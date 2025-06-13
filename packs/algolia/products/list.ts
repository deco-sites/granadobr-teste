import { AppContext } from "site/apps/site.ts";
import { Product } from "apps/commerce/types.ts";
import { getClientAlgolia } from "../../utils/algolia/client.ts";
import { SearchResponse } from "npm:@algolia/client-search";
import { ProductFromAlgolia } from "../../utils/algolia/types.ts";
import { toProduct } from "../../utils/algolia/transform.ts";
import { indexNames } from "site/loaders/algolia/listIndex.ts";
import generateCacheKey from "site/packs/utils/generateCacheKey.ts";

export interface Error {
  status: number;
  message: string;
}

interface Props {
  /**
   * @title Quantidade de produtos
   * @description Número máximo de produtos a serem devolvidos
   */
  hitsPerPage: number;

  /**
   * @title Facets
   * @description Facets para filtrar
   */
  facetFilters?: string;

  /** @description Consulta de pesquisa de texto completo */
  term?: string;

  indexName: indexNames;
}

export const cacheKey = (props: Props, req: Request, _ctx: AppContext) => {
  return generateCacheKey<Props>(req.url, props);
};

/**
 * @title Algolia Integration
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Product[] | null> => {
  const { currencyCode, algoliaUrlProducts } = ctx;
  const { term, hitsPerPage, facetFilters } = props;

  const client = await ctx.invoke.algolia.loaders.client({});

  const url = new URL(req.url);
  if (!client) return null;
  const { results } = await client.search([{
    indexName: props.indexName.products ?? "",
    query: term ?? "",
    params: {
      hitsPerPage: hitsPerPage ?? 12,
      facetFilters: JSON.parse(facetFilters ?? "[]"),
      clickAnalytics: true,
    },
  }]);

  const { hits: products } = results[0] as SearchResponse<
    ProductFromAlgolia
  >;

  return products.map((product) =>
    toProduct({
      product,
      options: {
        currencyCode: currencyCode,
        url: algoliaUrlProducts ? undefined : url.origin,
      },
    })
  );
};

export default loader;
