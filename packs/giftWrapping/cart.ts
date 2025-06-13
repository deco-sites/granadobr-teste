import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { CartWithGW } from "site/packs/utils/client/types.ts";

export default async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<CartWithGW | null> {
  const { magento: { site } } = ctx;
  const clientAdmin = getClientMagento(ctx);

  const quote_id = getCartCookie(req.headers);

  if (!quote_id || !clientAdmin) {
    return null;
  }
  const giftWrapping = await clientAdmin
    ["GET /rest/all/V1/:site/customapi/giftwrapping/:quote_id"]({
      site,
      quote_id,
    }).then((res) => res.json());

  return giftWrapping;
}
