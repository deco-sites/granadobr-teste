import { AppContext } from "site/apps/site.ts";
import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { SearchResponse } from "npm:@algolia/client-search";
import { ProductFromAlgolia } from "../../utils/algolia/types.ts";
import { toProduct } from "../../utils/algolia/transform.ts";
import { cleanObject } from "site/packs/utils/algolia/utils.ts";
import { indexNames } from "site/loaders/algolia/listIndex.ts";
import { getClientAlgoliaRecommendation } from "site/packs/utils/algolia/client.ts";
import generateCacheKey from "site/packs/utils/generateCacheKey.ts";

interface Props {
  productId: ProductDetailsPage | null;
  indexName: indexNames;
  /**
   * @title Configuração de recomendação
   */
  algoliaConfig: RecommendRequest;

  apiKey: string;
  applicationId: string;
}

interface RecommendRequest {
  /**
   * @title Quantidade de produtos
   * @description Número máximo de produtos a serem devolvidos
   */
  maxRecommendations: number;

  /**
   * @title Limite de relevância
   * @description Limite mínimo de relevância para os produtos recomendados
   */
  threshold?: number;

  /**
   * @title Parâmetros de consulta
   * @description Parâmetros adicionais para refinar a consulta de recomendação
   */
  queryParameters?: QueryParameters;
}

interface QueryParameters {
  query?: string;
  filters?: string;
  facetFilters?: string[];
  numericFilters?: string[];
  tagFilters?: string[];
  analyticsTags?: string[];
  distinct?: boolean;
  clickAnalytics?: boolean;
  analytics?: boolean;
  synonyms?: boolean;
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
  const { algoliaUrlProducts, currencyCode } = ctx;
  const {
    indexName,
    algoliaConfig,
    productId: productDetailsPage,
    apiKey,
    applicationId,
  } = props;
  const { maxRecommendations, threshold, queryParameters } = algoliaConfig;
  const { products: productsIndex } = indexName;
  try {
    const client = await getClientAlgoliaRecommendation(
      ctx,
      apiKey,
      applicationId,
    );
    const cleanedQueryParameters = cleanObject<QueryParameters>(
      queryParameters || {},
    );

    const recommend = await client.getFrequentlyBoughtTogether([
      {
        indexName: productsIndex,
        objectID: productDetailsPage?.product?.productID ?? "",
        maxRecommendations,
        threshold,
        queryParameters: cleanedQueryParameters,
      },
    ]);

    const { hits: products } = recommend.results[0] as SearchResponse<
      ProductFromAlgolia
    >;

    const url = new URL(req.url);
    return products.map((product) =>
      toProduct({
        product,
        options: {
          currencyCode,
          url: algoliaUrlProducts ? undefined : url.origin,
        },
      })
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default loader;
