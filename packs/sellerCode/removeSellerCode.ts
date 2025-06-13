import { AppContext } from "site/apps/site.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import { AppliedSellerCode } from "site/packs/utils/client/types.ts";

interface Props {
  sellerCode: string;
}

const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<AppliedSellerCode> => {
  const {
    magento: { site },
  } = ctx;
  const clientAdmin = getClientMagento(ctx);
  const cartId = getCartCookie(req.headers) as string;

  const body = {
    quote_id: Number(cartId),
    promocode: props.sellerCode,
    type: "seller",
  };

  try {
    const result = await clientAdmin[
      "DELETE /rest/:site/V1/granado/customapi/promolinkpro/"
    ](
      {
        site,
      },
      {
        body,
      },
    ).then((res) => res.json());

    if ("success" in result && result?.success) {
      return result;
    }

    throw new Error(result.message);
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export default action;
