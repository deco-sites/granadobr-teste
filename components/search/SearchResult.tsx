import { SendEventOnView } from "../../components/Analytics.tsx";
import { Layout as CardLayout } from "../../components/product/ProductCard.tsx";
import FiltersIsland from "../../islands/FiltersIsland.tsx"; // Atualizado
import Icon from "../../components/ui/Icon.tsx";
import SearchControls from "../../islands/SearchControls.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { customMapProductToAnalyticsItem } from "site/utils/analytics.ts";

import ProductGallery, {
  Columns,
  ShowcaseBannerProps,
} from "../product/ProductGallery.tsx";
import type { AppContext } from "site/apps/deco/records.ts";
import { Section } from "@deco/deco/blocks";

export type Format = "Show More" | "Pagination";

export interface Layout {
  variant?: "aside" | "drawer";
  columns?: Columns;
  format?: Format;
}

export interface Props {
  page: ProductListingPage | null;
  layout?: Layout;
  cardLayout?: CardLayout;
  startingPage?: 0 | 1;
  /**
   * @title Banner de showcase config
   */
  showcaseBanner?: ShowcaseBannerProps;

  notFound?: Section;
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}

function Result({
  page,
  layout,
  cardLayout,
  startingPage = 0,
  showcaseBanner,
  dontUpdateCartAfter,
  url: _url,
}: Omit<Props, "page"> & {
  page: ProductListingPage;
  url: string;
  pageDescription?: string;
  dontUpdateCartAfter: {
    addItem: boolean;
  };
}) {
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;

  const perPage = pageInfo?.recordPerPage || products.length;
  const url = new URL(_url);

  const { format = "Show More" } = layout ?? {};

  const id = useId();

  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const isPartial = url.searchParams.get("partial") === "true";
  const isFirstPage = !pageInfo.previousPage;

  const searchQuery = url.searchParams.get("q") || "Indefinido";
  const _lastBreadcrumbItem =
    breadcrumb.itemListElement?.[breadcrumb.itemListElement.length - 1]?.item ||
    searchQuery;

  return (
    <>
      <div
        className={`container mobile:max-w-full  mobile:!mx-0 lg:px-3 ${!isFirstPage ? "mt-6" : ""} ${
          !pageInfo.nextPage ? "pb-10" : ""
        }`}
      >
        {(isFirstPage || !isPartial) && (
          <>
          <div className="font-matria text-base font-light mb-9 mt-5 mobile:px-4">
              <a
                href="/"
                className="text-[#1D1D1D] font-normal font-matria"
                aria-label="Inicio"
              >
                {"Início"}
              </a>
              {breadcrumb.itemListElement.length > 0
                ? (
                  breadcrumb.itemListElement.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      aria-label={item.alternateName}
                    >
                      <span className="mx-4 text-gray-400">{">"}</span>
                      {item.item}
                    </a>
                  ))
                )
                : (
                  <span>
                    <span className="mx-4 text-gray-400">{">"}</span>
                    {"Resultados de: '"}
                    {searchQuery}
                    {"'"}
                  </span>
                )}
            </div>
            <div className="mobile:sticky mobile:px-4 mobile:top-[86px] mobile:z-50 mobile:bg-white desktop:flex desktop:flex-row desktop:justify-between desktop:items-center desktop:mb-[20px]">
      
            {
              <div className="font-granado text-green-800 text-6xl mobile:hidden">
              {breadcrumb.itemListElement.length > 0
                ? _lastBreadcrumbItem
                : `Resultados de: '${searchQuery}'`}
            </div> 
            }
            <SearchControls
              sortOptions={sortOptions} 
              filters={filters}
              breadcrumb={breadcrumb}
              displayFilter={layout?.variant === "drawer"}
            />
          </div>
          </>
          
        )}

        <div className="flex flex-row font-matria mobile:mx-4">
          <div className="hidden sm:block w-min min-w-[380px]">
            {layout?.variant === "aside" && filters.length > 0 &&
              (isFirstPage || !isPartial) && (
              <aside className="hidden sm:block">
                <div className="text-3xl font-light px-6 pt-6 bg-gray-100 max-w-[380px] shadow mr-8">
                  Filtros
                </div>
                <FiltersIsland filters={filters} />
              </aside>
            )}
          </div>
          <div className="flex-grow" id={id}>
            <ProductGallery
              dontUpdateCartAfter={dontUpdateCartAfter}
              products={products}
              offset={offset}
              layout={{ card: cardLayout, columns: layout?.columns, format }}
              pageInfo={pageInfo}
              url={url}
              showcaseBanner={showcaseBanner}
            />
            {format == "Pagination" && (
              <div className="flex justify-center my-4">
                <div className="flex gap-2">
                  {pageInfo.previousPage && (
                    <a
                      aria-label="previous page link"
                      rel="prev"
                      href={pageInfo.previousPage ?? "#"}
                      className="btn btn-ghost join-item bg-purple-100 rounded"
                    >
                      <Icon id="ChevronLeft" size={14} strokeWidth={2} />
                    </a>
                  )}
                  {(() => {
                    const totalPages = Math.ceil(
                      pageInfo.records / pageInfo.recordPerPage,
                    );
                    const currentPage = pageInfo.currentPage;
                    let pages = [];

                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      pages = Array.from(
                        { length: totalPages },
                        (_, i) => i + 1,
                      );
                    } else {
                      // Complex logic for more than 5 pages
                      if (currentPage <= 3) {
                        // Near the start
                        pages = [1, 2, 3, 4, 5, null, totalPages];
                      } else if (currentPage >= totalPages - 2) {
                        // Near the end
                        pages = [
                          1,
                          null,
                          totalPages - 4,
                          totalPages - 3,
                          totalPages - 2,
                          totalPages - 1,
                          totalPages,
                        ];
                      } else {
                        // Somewhere in the middle
                        pages = [
                          1,
                          null,
                          currentPage - 1,
                          currentPage,
                          currentPage + 1,
                          null,
                          totalPages,
                        ];
                      }
                    }

                    return pages.map((pageNum, index) => {
                      if (pageNum === null) {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="btn btn-ghost join-item rounded bg-purple-100"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageURL = new URL(url);
                      pageURL.searchParams.set("p", String(pageNum));

                      return (
                        <a
                          key={pageNum}
                          href={currentPage != pageNum ? pageURL.href : "#"}
                        >
                          <span
                            className={`btn btn-ghost join-item rounded ${
                              currentPage == pageNum
                                ? "bg-[#cbffe8]"
                                : "bg-purple-100"
                            }`}
                          >
                            {pageNum}
                          </span>
                        </a>
                      );
                    });
                  })()}
                  {pageInfo.nextPage && (
                    <a
                      aria-label="next page link"
                      rel="next"
                      href={pageInfo.nextPage ?? "#"}
                      className="btn btn-ghost join-item bg-purple-100 rounded"
                    >
                      <Icon id="ChevronRight" size={14} strokeWidth={2} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SendEventOnView
        id={id}
        event={{
          name: "view_item_list",
          params: {
            item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
            item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
            items: page.products?.map((product, index) =>
              customMapProductToAnalyticsItem({
                ...(useOffer(product.offers)),
                index: offset + index,
                product,
                breadcrumbList: page.breadcrumb,
              })
            ),
          },
        }}
      />
    </>
  );
}

function SearchResult({ page, notFound, ...props }: ReturnType<typeof loader>) {
  if (!page) {
    if (notFound) {
      return <notFound.Component {...notFound.props} />;
    }
    return <NotFound />;
  }

  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  // const records = await ctx.invoke.records.loaders.drizzle();

  // const product = props.page?.products?.[0];

  // if (product) {
  //   const currentProduct = await records.select().from(products).where(
  //     eq(products.product_id, product.productID),
  //   );

  //   console.log({ currentProduct });

  //   if (!currentProduct.length) {
  //     const data = await records.insert(products).values({
  //       product_id: product.productID,
  //       sku: product.sku,
  //       category: product.category,
  //       url: product.url,
  //       name: product.name,
  //       award: product.award,
  //       offer_count: product.offers?.offerCount,
  //       gtin: product.gtin,
  //     });
  //   }
  // }\

  return {
    ...props,
    url: req.url,
    dontUpdateCartAfter: {
      addItem: ctx.features.dontUpdateCartAfterAddItem ?? false,
      onLoad: ctx.features.dangerouslyDisableOnLoadUpdate ?? false,
    },
  };
};

export default SearchResult;
