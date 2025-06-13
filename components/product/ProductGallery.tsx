import { Head } from "$fresh/runtime.ts";
import { PageInfo, Product } from "apps/commerce/types.ts";
import ProductCard, {
  Layout as CardLayout,
} from "../../components/product/ProductCard.tsx";
import { Format } from "../../components/search/SearchResult.tsx";
import Spinner from "../../components/ui/Spinner.tsx";
import ShowMore from "../../islands/ShowMore.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { usePartialSection } from "@deco/deco/hooks";
import BFShowcaseBanner, {
  Props as BFShowcaseBannerProps,
} from "../../components/BFShowCaseBanner/BFShowcaseBanner.tsx";
import { useDevice } from "@deco/deco/hooks";

export interface Columns {
  mobile?: 1 | 2;
  desktop?: 2 | 3 | 4 | 5;
}
export interface Props {
  products: Product[] | null;
  pageInfo: PageInfo;
  offset: number;
  layout?: {
    card?: CardLayout;
    columns?: Columns;
    format?: Format;
  };
  url: URL;
  dontUpdateCartAfter: {
    addItem: boolean;
  };
  /** @title Banner de showcase */
  showcaseBanner?: ShowcaseBannerProps;
}

export interface ShowcaseBannerProps {
  banner?: BFShowcaseBannerProps;
  positionMobile?: number;
  positionDesktop?: number;
}

const MOBILE_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};
const DESKTOP_COLUMNS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
};

function HandleShowcaseBanner(
  bannerData: BFShowcaseBannerProps,
  isMobile: boolean,
  index: number,
  mobileNumber: number,
  desktopNumber: number,
) {
  if (!bannerData) return null;
  const mobilePosition = index + 1 === mobileNumber;
  const desktopPosition = index + 1 === desktopNumber;

  if (isMobile && mobilePosition) {
    return (
      <div className="col-span-full">
        <BFShowcaseBanner {...bannerData} />
      </div>
    );
  }
  if (!isMobile && desktopPosition) {
    return (
      <div className="col-span-full">
        <BFShowcaseBanner {...bannerData} />
      </div>
    );
  }
}

function ProductGallery(
  {
    products,
    pageInfo,
    layout,
    offset,
    url,
    dontUpdateCartAfter,
    showcaseBanner,
  }: Props,
) {
  const isMobile = useDevice() != "desktop";
  const platform = usePlatform();
  const mobile = MOBILE_COLUMNS[layout?.columns?.mobile ?? 2];
  const desktop = DESKTOP_COLUMNS[layout?.columns?.desktop ?? 4];
  const nextPage = pageInfo.nextPage
    ? new URL(pageInfo.nextPage, url.href)
    : null;
  const partialUrl = nextPage ? new URL(nextPage.href) : null;
  if (pageInfo.nextPage && nextPage) {
    partialUrl?.searchParams.set("partial", "true");
  }
  return (
    <div
      class={`grid ${mobile} gap-x-2 gap-y-6 items-center ${desktop} sm:gap-x-2 `}
    >
      {layout?.format == "Show More" && (
        <Head>
          {pageInfo.nextPage && <link rel="next" href={pageInfo.nextPage} />}
          {pageInfo.previousPage && (
            <link rel="prev" href={pageInfo.previousPage} />
          )}
        </Head>
      )}

      {products?.map((product, index) => (
        <>
          <ProductCard
            dontUpdateCartAfter={dontUpdateCartAfter}
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            layout={layout?.card}
            platform={platform}
          />
          {HandleShowcaseBanner(
            showcaseBanner?.banner!,
            isMobile,
            index,
            showcaseBanner?.positionMobile!,
            showcaseBanner?.positionDesktop!,
          )}
        </>
      ))}

      {(layout && layout?.format === "Show More") && (
        <>
          <ShowMore pageInfo={pageInfo}>
            {partialUrl && (
              <div>
                <div class="mt-2">
                  <Spinner size={24} />
                </div>
                <button
                  id={`show-more-button-${pageInfo.currentPage}`}
                  class="btn cursor-pointer hidden w-0 h-0 absolute"
                  {...usePartialSection({
                    href: partialUrl.href,
                    mode: "append",
                  })}
                >
                  Ver Mais
                </button>
              </div>
            )}
          </ShowMore>
        </>
      )}
    </div>
  );
}
export default ProductGallery;
