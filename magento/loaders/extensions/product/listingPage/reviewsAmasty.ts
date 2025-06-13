
import { ProductListingPage } from "apps/commerce/types.ts";
import { AppContext } from "../../../../mod.ts";
import { ExtensionProps } from "../../../../utils/client/types.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";

/**
 * @title Magento ExtensionOf Listing Page - Amasty Reviews
 * @description Add extra data to your loader. This may harm performance
 */
const loader = (
  props: ExtensionProps,
  _req: Request,
  ctx: AppContext,
): ExtensionOf<ProductListingPage | null> =>
async (page: ProductListingPage | null) => {
  if (!page) {
    return page;
  }

  if (props.active) {
    const product = await ctx.invoke.magento.loaders.extensions.product
      .reviewsAmasty({
        products: page.products,
        path: props.path,
        from: "PLP",
      });

    return {
      ...page,
      product: product[0],
    };
  }
  return page;
};

export default loader;
