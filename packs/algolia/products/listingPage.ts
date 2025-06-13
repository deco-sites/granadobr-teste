import { AppContext } from "site/apps/site.ts";
import { ListItem, ProductListingPage } from "apps/commerce/types.ts";
import { getClientAlgolia } from "../../utils/algolia/client.ts";
import { indexNames } from "site/loaders/algolia/listIndex.ts";
import { SearchResponse } from "npm:@algolia/client-search";
import {
  getPageInfo,
  toProduct,
  transformFacets,
} from "../../utils/algolia/transform.ts";
import {
  CategoryHit,
  Facet,
  IndexedSuggestion,
  ProductFromAlgolia,
} from "../../utils/algolia/types.ts";

export interface Props {
  /**
   * @title Página de Categoria
   * @default false
   */
  isCategoryPage?: boolean;
  /**
   * @title Termo de busca
   */
  term?: string;
  /**
   * @title Index
   * @description Nome do index que vamos usar para buscar os produtos
   */
  indexName: indexNames;
  /**
   * @title Items por página.
   */
  hitsPerPage?: number;
  startingPage?: 0 | 1;
  /**
   * @title Facets
   * @description Lista de nomes de facets dos produtos para renderizar no website
   */
  facets?: Facet[];
  /**
   * @description https://www.algolia.com/doc/api-reference/api-parameters/sortFacetValuesBy/
   */
  sortFacetValuesBy?: "count" | "alpha";
  /** @description Isso é para definir os filtros de ordenação que vamos usar na página */
  sortOptions?: ProductListingPage["sortOptions"];
}

export const cache = "stale-while-revalidate";

export const cacheKey = (_props: Props, req: Request, _ctx: AppContext) => {
  if (term || !isCategoryPage) return null;

  const url = new URL(req.url);

  return `${url.pathname}-${sortSearchParams(url)}`;
};

/**
 * @title Algolia Integration - PLP Loader
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductListingPage | null> => {
  const { currencyCode } = ctx;

  const client = await ctx.invoke.algolia.loaders.client({});
  if (!client) return null;

  const preffix = ctx.magento.site;
  const url = new URL(req.url);
  const term = props.isCategoryPage
    ? url.pathname.replace(`/${preffix}/`, "")
    : props.term || url.searchParams.get("q") ||
      (url.searchParams.get("busca") ?? "");
  const indexName = url.searchParams.get("sort") || (props.indexName.products ??
    "");
  const startingPage = props.startingPage ?? 0;
  const pageIndex = Number(url.searchParams.get("page")) || startingPage;
  const facetFilters: [string, string[]][] = JSON.parse(
    url.searchParams.get("facetFilters") ?? "[]",
  );

  const fFilters = facetFilters.map(([key, values]) =>
    `(${values.map((value) => `${key}:"${value}"`).join(" OR ")})`
  ).join(" AND ");
  const { results } = await client.search([{
    indexName,
    query: term,
    params: {
      hitsPerPage: props.hitsPerPage ?? 12,
      filters: fFilters,
      clickAnalytics: true,
      page: pageIndex,
    },
  }, {
    indexName,
    query: term,
    params: {
      facetingAfterDistinct: true,
      facets: (props.facets?.length || 0) > 0
        ? props.facets?.map((f) => f.name)
        : ["*"],
      hitsPerPage: 0,
      sortFacetValuesBy: props.sortFacetValuesBy,
    },
  }, {
    indexName: props.indexName.categories!,
    query: term,
    params: {
      hitsPerPage: props.hitsPerPage ?? 12,
    },
  }]);

  const [
    { hits, page, nbPages, nbHits, hitsPerPage },
    { facets },
  ] = results as SearchResponse<ProductFromAlgolia>[];

  if (hits.length === 0) {
    return null;
  }

  const products = hits.map((product) => {
    return toProduct({
      product,
      options: {
        url: url.origin,
        currencyCode,
      },
    });
  });

  const pageInfo = getPageInfo(
    page,
    nbPages,
    nbHits,
    hitsPerPage,
    url,
    startingPage,
  );

  const filters = transformFacets(facets ?? {}, {
    order: props.facets ?? [],
    facetFilters,
    url,
  });

  const indexedCategories = results[2] as IndexedSuggestion<CategoryHit>;

  const category = props.isCategoryPage
    ? indexedCategories.hits.find((h) =>
      new URL(h.url).pathname.endsWith(term)
    ) ?? {} as Partial<CategoryHit>
    : undefined;

  const categories = props.isCategoryPage
    ? term.split("/").map((t) =>
      indexedCategories.hits.find((h) => new URL(h.url).pathname.endsWith(t))
        ?.name ?? transformSlug(t)
    )
    : undefined;

  const itemListElement = (categories?.map((name, i) => (
    {
      "@type": "ListItem",
      item: name,
      position: i,
    }
  )) ?? []) as ListItem[];

  return {
    "@type": "ProductListingPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement,
      numberOfItems: itemListElement?.length,
    },
    filters,
    products,
    pageInfo,
    sortOptions: props?.sortOptions ?? [],
    seo: {
      title: category?._highlightResult?.meta_title?.value ?? category?.name ??
        transformSlug(term),
      description: category?._highlightResult?.meta_description?.value ?? "",
      canonical: url.href,
    },
  };
};

export const sortSearchParams = (url: URL) => {
  const paramsArray = Array.from(url.searchParams.entries());
  paramsArray.sort((a, b) => a[0].localeCompare(b[0]));
  const sortedParams = paramsArray.map(([key, value]) => {
    const sortedValue = value.split("_").sort((a, b) => a.localeCompare(b))
      .join("_");
    return `${key}=${sortedValue}`;
  });
  return sortedParams.join("&");
};

function transformSlug(str: string) {
  return str.replace(
    /(^|-)(\w)/g,
    (_match, separator, char) => separator + char.toUpperCase(),
  ).replace(/-/g, " ");
}

export default loader;
