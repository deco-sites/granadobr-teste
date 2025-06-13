import { AppContext } from "site/apps/site.ts";
import { getCartCookie } from "site/magento/utils/cart.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import { ErrorGiftAPI, ProductsGift } from "site/packs/utils/client/types.ts";

export const cacheKey = (_props: unknown, req: Request, _ctx: AppContext) => {
  return req.url.toString();
};

/**
 * @title get gifts items
 */
const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<ProductsGift | ErrorGiftAPI | null> => {
  const { magento: { site } } = ctx;
  const clientAdmin = getClientMagento(ctx);
  const cartId = getCartCookie(req.headers) as string;

  if (!cartId || !clientAdmin) {
    return null;
  }

  try {
    return await clientAdmin["GET /rest/:site/V1/gift/quote/:quoteId"]({
      site,
      quoteId: cartId,
    }).then((res) => res.json());
  } catch (e) {
    return {
      message: e.message,
      status: e.status,
    };
  }
};

export default loader;
