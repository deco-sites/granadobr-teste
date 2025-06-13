
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "../../../../mod.ts";
import { ExtensionProps } from "../../../../utils/client/types.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";

/**
 * @title Magento ExtensionOf Details Page - Livelo Points
 * @description Add extra data to your loader. This may harm performance
 */
const loader = (
  props: ExtensionProps,
  _req: Request,
  ctx: AppContext,
): ExtensionOf<ProductDetailsPage | null> =>
async (page: ProductDetailsPage | null) => {
  if (!page) {
    return page;
  }

  if (props.active) {
    const product = await ctx.invoke.magento.loaders.extensions.product
      .liveloPoints({
        products: [page.product],
        path: props.path,
        from: "PDP",
      });

    return {
      ...page,
      product: product[0],
    };
  }
  return page;
};

export default loader;
