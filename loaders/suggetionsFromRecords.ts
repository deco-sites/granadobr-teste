import { Suggestion } from "apps/commerce/types.ts";
import {
  buildProducts,
  getDBProducts,
} from "site/loaders/productsFromRecords.ts";
import { AppContext } from "site/apps/site.ts";
import { AppContext as MagentoContext } from "site/magento/mod.ts";

export interface Props {
  query: string;

  /** @description number of suggested terms/products to return */
  count?: number;

  unavailableThreshold?: number;
}

export default async function loader(
  { query, count = 8, unavailableThreshold = 0 }: Props,
  _req: Request,
  ctx: AppContext & MagentoContext,
): Promise<Suggestion | null> {
  const records = await ctx.invoke.records.loaders.drizzle();

  if (!query) return null;

  const result = await getDBProducts({
    records,
    filtersParams: {},
    quantity: count,
    offset: 0,
    search: query,
  });

  if (!result) return null;

  const {
    productGroups,
    offersDB,
    imagesData,
    productsDB,
    priceSpecifications,
    properties,
  } = result;

  const products = buildProducts({
    offers: offersDB,
    priceSpecifications,
    productGroups,
    products: productsDB,
    images: imagesData,
    properties,
    unavailableThreshold,
  });

  return {
    products,
  };
}
