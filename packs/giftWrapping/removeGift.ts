import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { CartWithGW } from "site/packs/utils/client/types.ts";
import { OverrideFeatures } from "../utils/client/types.ts";
import { giftWrappingActionHandler } from "site/packs/utils/utils.ts";

export interface Props extends OverrideFeatures {
  itemId: string;
}

export default async function loader(
  { itemId, dangerouslyOverrideReturnOnlyStatement }: Props,
  req: Request,
  ctx: AppContext,
): Promise<CartWithGW | null> {
  const {
    magento: { site },
    features,
  } = ctx;
  const clientAdmin = getClientMagento(ctx);

  const quoteId = getCartCookie(req.headers);

  const returnOnlyStatement = dangerouslyOverrideReturnOnlyStatement ??
    features?.dangerouslyReturnOnlyStatement ?? false;

  const body = {
    quoteId,
    itemId,
  };
  try {
    const response = await clientAdmin
      ["PUT /rest/all/V1/:site/customapi/giftwrapping/"](
        {
          site,
        },
        { body },
      ).then((result) => result.json());

    if ("success" in response && response?.success) {
      return giftWrappingActionHandler(returnOnlyStatement, {
        req,
        ctx,
        responseMessage: response,
      });
    }

    throw new Error(response.message);
  } catch (error) {
    return giftWrappingActionHandler(returnOnlyStatement, {
      req,
      ctx,
      responseMessage: {
        success: false,
        message: "Failed at add gift: " + error.message,
      },
    });
  }
}
