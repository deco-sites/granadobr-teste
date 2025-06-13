import type { AppContext as AppContextMagento } from "site/magento/mod.ts";
import { Wishlist } from "site/magento/utils/client/types.ts";
import { SESSION_COOKIE } from "site/magento/utils/constants.ts";
import { getUserCookie } from "site/magento/utils/user.ts";
import type { AppContext } from "site/apps/site.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";

export interface Props {
  productId: string;
}

/**
 * @title Magento Integration - Remove item from Wishlist
 * @description Remove from wishlist action
 */
const action = async (
  { productId }: Props,
  req: Request,
  ctx: AppContext & AppContextMagento,
): Promise<Wishlist | null> => {
  try {
    const clientAdmin = getClientMagento(ctx);

    const id = getUserCookie(req.headers);

    const headers = new Headers({
      Cookie: `${SESSION_COOKIE}=${id}`,
    });

    // @ts-expect-error - Check this route
    const res = await clientAdmin
      ["DELETE /rest/default/V1/wishlist/item/:itemid"](
        {
          itemid: productId,
        },
        {
          headers,
        },
      ).then((res: { json: () => any }) => {
        return res.json();
      }).then((res: string | Record<string, unknown> | unknown) => {
        if (typeof res === "string") {
          return JSON.parse(res);
        }
        if (typeof res === "object") {
          return res;
        }

        return res;
      }).catch(() => {
        return null;
      });

    if (res.success) return ctx.invoke.magento.loaders.wishlist();

    return null;
  } catch (error) {
    console.log("REMOVE", error);
    return null;
  }
};

export default action;
