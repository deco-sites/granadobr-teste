import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { AppliedSellerCode } from "site/packs/utils/client/types.ts";

export default async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<AppliedSellerCode | null> {
  const {
    magento: { site },
  } = ctx;

  const clientAdmin = getClientMagento(ctx);
  const quote_id = getCartCookie(req.headers);

  if (!quote_id || !clientAdmin) {
    return null;
  }

  const appliedSellerCode = await clientAdmin[
    "GET /rest/:site/V1/granado/customapi/promolinkpro/:quote_id/seller"
  ]({
    site,
    quote_id,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return { success: false, message: error.message };
    });

  return appliedSellerCode;
}
