import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { ErrorGiftAPI, ProductsGift } from "site/packs/utils/client/types.ts";
import { OverrideFeatures } from "../utils/client/types.ts";
import { giftActionHandler } from "site/packs/utils/utils.ts";

interface Props extends OverrideFeatures {
  giftId: number;
}

/**
 * @title Remove gift item
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductsGift | ErrorGiftAPI> => {
  const {
    magento: { site },
    features,
  } = ctx;
  const { dangerouslyOverrideReturnOnlyStatement, giftId } = props;
  const clientAdmin = getClientMagento(ctx);
  const cartId = getCartCookie(req.headers) as string;

  const returnOnlyStatement = dangerouslyOverrideReturnOnlyStatement ??
    features?.dangerouslyReturnOnlyStatement ?? false;

  try {
    const responseMessage = await clientAdmin[
      "DELETE /rest/:site/V1/gift/quote/:quoteId/items/:itemId"
    ]({
      site,
      quoteId: cartId,
      itemId: giftId,
    }).then((res) => res.json());

    if ("success" in responseMessage && responseMessage?.success) {
      return giftActionHandler(returnOnlyStatement, {
        req,
        ctx,
        responseMessage,
      });
    }

    throw new Error(responseMessage.message);
  } catch (e) {
    return giftActionHandler(returnOnlyStatement, {
      req,
      ctx,
      responseMessage: {
        message: e.message,
        status: e.status,
      },
    });
  }
};

export default loader;
