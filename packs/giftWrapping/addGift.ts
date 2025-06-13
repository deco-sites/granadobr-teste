import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import { getUserCookie } from "site/magento/utils/user.ts";
import { SESSION_COOKIE } from "site/magento/utils/constants.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { CartWithGW } from "site/packs/utils/client/types.ts";
import { OverrideFeatures } from "../utils/client/types.ts";
import { giftWrappingActionHandler } from "site/packs/utils/utils.ts";

export interface Props extends OverrideFeatures {
  itemId: string;
  wrapping_id: number;
}

// This loader dependes the useCart has been used before
const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<CartWithGW | null> => {
  const {
    magento: { site },
    features,
  } = ctx;
  const { itemId, wrapping_id, dangerouslyOverrideReturnOnlyStatement } = props;
  const returnOnlyStatement = dangerouslyOverrideReturnOnlyStatement ??
    features?.dangerouslyReturnOnlyStatement ?? false;
  const clientAdmin = getClientMagento(ctx);
  const cartId = getCartCookie(req.headers) as string;
  const sessionCookie = getUserCookie(req.headers);

  const body = {
    itemId: itemId,
    quoteId: cartId,
    gwId: Number(wrapping_id),
  };

  try {
    const response = await clientAdmin[
      "POST /rest/all/V1/:site/customapi/giftwrapping"
    ](
      {
        site,
      },
      {
        body,
        headers: new Headers({ Cookie: `${SESSION_COOKIE}=${sessionCookie}` }),
      },
    ).then((res) => res.json());

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
};

export default action;
