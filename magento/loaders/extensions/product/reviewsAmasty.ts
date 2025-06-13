import { Product } from "apps/commerce/types.ts";
import { STALE as DecoStale } from "apps/utils/fetch.ts";
import { AppContext } from "../../../mod.ts";
import { ExtensionLoaderProps } from "../../../utils/client/types.ts";
import { toReviewAmasty } from "../../../utils/transform.ts";
import { sanitizePath } from "../../../utils/utils.ts";

/**
 * @title Magento Product Extension Loader - Reviews Amasty
 * @description Only invokable
 */
async function loader(
  { products, path }: ExtensionLoaderProps,
  _req: Request,
  ctx: AppContext,
): Promise<Product[]> {
  const STALE = ctx.enableCache ? DecoStale : undefined;

  const reviews = await Promise.all(
    products.map(
      async (product) =>
        await ctx.clientAdmin["GET /rest/:reviewUrl/:productId"](
          {
            reviewUrl: sanitizePath(path),
            productId: product!.productID,
          },
          STALE,
        ).then((review) => review.json()),
    ),
  );

  return toReviewAmasty(products, reviews);
}

export const cache = {
  maxAge: 60 * 60 * 24, // 24 hours
};

export const cacheKey = (
  { products, path, from }: ExtensionLoaderProps,
  _req: Request,
  _ctx: AppContext,
) => {
  const skus = products?.reduce((acc, p) => `${acc}|${p.sku}`, "");
  return `${skus}-amastyReviewsExt-${path}-${from}`;
};

export default loader;
