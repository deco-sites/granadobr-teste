import { Suggestion } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/site.ts";
import { getClientAlgolia } from "site/packs/utils/algolia/client.ts";
import { indexNames } from "site/loaders/algolia/listIndex.ts";
import {
  CategoryHit,
  IndexedSuggestion,
  PageHit,
  ProductFromAlgolia,
} from "site/packs/utils/algolia/types.ts";
import { toProduct } from "site/packs/utils/algolia/transform.ts";
import type { MultipleQueriesQuery } from "npm:@algolia/client-search";

interface Props {
  query?: string;

  /** @description number of suggested terms/products to return */
  count?: {
    categories?: number;
    pages?: number;
    products?: number;
  };

  indexName: indexNames;
}

/**
 * @title Algolia Integration
 */
const loader = async (
  { query, count, indexName }: Props,
  req: Request,
  ctx: AppContext,
): Promise<Suggestion | null> => {
  const { algoliaUrlProducts, currencyCode } = ctx;
  const url = new URL(req.url);

  const client = await ctx.invoke.algolia.loaders.client({});
  const {
    products: productsIndex,
    categories: categoriesIndex,
    pages: pagesIndex,
  } = indexName;

  const searchIndexes = [
    { indexName: productsIndex, params: { hitsPerPage: count?.products ?? 0 } },
    {
      indexName: categoriesIndex,
      params: { hitsPerPage: count?.categories ?? 0 },
    },
    { indexName: pagesIndex, params: { hitsPerPage: count?.pages ?? 0 } },
  ];

  const createSearch = searchIndexes
    .filter(({ indexName }) => indexName?.length)
    .map(({ indexName, params }) => ({
      indexName,
      params,
      query,
    })) as MultipleQueriesQuery[];

  if (!client) return null;
  try {
    const { results } = await client.search(createSearch);

    const indexedProducts = results[0] as IndexedSuggestion<ProductFromAlgolia>;
    const indexedCategories = results[1] as IndexedSuggestion<CategoryHit>;
    const indexedPages = results[2] as IndexedSuggestion<PageHit>;
    const products = indexedProducts.hits.map((product) =>
      toProduct({
        product,
        options: {
          currencyCode: currencyCode,
          url: algoliaUrlProducts ? undefined : url.origin,
        },
      })
    );

    const searches = [indexedCategories, indexedPages].map((s) => {
      const type = s.index === categoriesIndex ? "category" : "page";

      return s.hits.map(
        (item) => {
          return {
            term: item.name,
            href: new URL(item.url).pathname,
            facets: [
              { key: "type", values: [type] },
              { key: "content", values: [item?.content ?? ""] },
              { key: "path", values: [item?.path ?? ""] },
              { key: "_tags", values: [item?._tags ?? ""] },
            ],
          };
        },
      ).flat();
    }).flat();

    return {
      searches,
      products,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default loader;
