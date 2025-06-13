import { AppContext } from "../../apps/site.ts";
import { customMapProductToAnalyticsItem } from "site/utils/analytics.ts";
import ProductCard, {
  Layout as cardLayout,
} from "../../components/product/ProductCard.tsx";
import { SendEventOnView } from "../../components/Analytics.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import Show from "../../directives/Show/index.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { clx } from "../../sdk/clx.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import type { Product } from "apps/commerce/types.ts";
import { type SectionProps } from "@deco/deco";
export interface Props {
  products: Product[] | null;
  title?: string;
  description?: string;
  layout?: {
    twoColumns?: boolean;
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    showArrows?: boolean;
    showDots?: boolean;
  };
  /**
   * @description a unique identifier to use on trigger selectors in GTM
   */
  gtmListId?: string;
  cardLayout?: cardLayout;
}
function ProductShelf(
  {
    title,
    products,
    cardLayout,
    dontUpdateCartAfter,
    description,
    layout,
    gtmListId,
  }: SectionProps<typeof loader>,
) {
  if (!products || products.length === 0) {
    return null;
  }
  const id = useId();
  const platform = usePlatform();
  const numSlidesMobile = layout?.numberOfSliders?.mobile ?? 2;
  const numSlidesDesktop = layout?.numberOfSliders?.desktop ?? 4;
  const slideStyle = {
    mobile: {
      1: "w-full",
      2: "w-[calc(50%_-_8px)]",
      3: "w-[calc((100%_/_3)_-_11px)]",
      4: "w-[calc(25%_-_12px)]",
      5: "w-[calc(20%_-_13px)]",
    },
    desktop: {
      1: "md:w-full",
      2: `md:w-[calc(50%_-_8px)] ${
        layout?.twoColumns ? "" : "lg:w-[calc(50%_-_12px)]"
      }`,
      3: "md:w-[calc((100%_/_3)_-_11px)] lg:w-[calc((100%_/_3)_-_16px)]",
      4: `md:w-[calc(25%_-_12px)] ${
        layout?.twoColumns ? "" : "lg:w-[calc(25%_-_18px)]"
      }`,
      5: `md:w-[calc(20%_-_13px)] ${
        layout?.twoColumns ? "" : "lg:w-[calc(20%_-_20px)]"
      }`,
    },
  };
  const dotStyle = {
    mobile: {
      1: "[&:nth-child(1n+1)]:block md:[&:nth-child(1n+1)]:hidden",
      2: "[&:nth-child(2n+1)]:block md:[&:nth-child(2n+1)]:hidden",
      3: "[&:nth-child(3n+1)]:block md:[&:nth-child(3n+1)]:hidden",
      4: "[&:nth-child(4n+1)]:block md:[&:nth-child(4n+1)]:hidden",
      5: "[&:nth-child(5n+1)]:block md:[&:nth-child(5n+1)]:hidden",
    },
    desktop: {
      1: "md:[&:nth-child(1n+1)]:!block",
      2: "md:[&:nth-child(2n+1)]:!block",
      3: "md:[&:nth-child(3n+1)]:!block",
      4: "md:[&:nth-child(4n+1)]:!block",
      5: "md:[&:nth-child(5n+1)]:!block",
    },
  };
  return (
    <div
      class="w-full max-w-screen-4xl 4xl:mx-auto"
      data-gtm-list-id={gtmListId}
    >
      <div
        id={id}
        class={`flex flex-col pb-7 md:pb-6 pt-9 md:pt-10 
        ${
          layout?.twoColumns
            ? "lg:flex-row lg:items-center lg:gap-9 mx-4 md:mx-6 lg:mx-12 2xl:mx-16"
            : ""
        }`}
      >
        <Show when={!!title || !!description}>
          <div
            class={`flex flex-col gap-4 mb-8 ${
              layout?.twoColumns ? "basis-1/4" : "basis-auto"
            }`}
          >
            <Show when={!!title}>
              <div class="font-granado text-5xl text-green-800 text-center">
                {title}
              </div>
            </Show>

            <Show when={!!description}>
              <span class="font-matria text-lg leading-6 text-gray-950 text-center">
                {description}
              </span>
            </Show>
          </div>
        </Show>

        <div
          class={`flex flex-col ${
            layout?.twoColumns
              ? "basis-[calc(75%_-_1px)]"
              : "mx-4 md:mx-6 lg:mx-12 2xl:mx-16"
          }`}
        >
          <div class="grid relative">
            <Slider
              data-slider-id={id}
              class={`carousel gap-4 row-start-2 row-end-5 ${
                layout?.twoColumns ? "lg:gap-4" : "lg:gap-6"
              }`}
            >
              {products?.map((product, index) => (
                <Slider.Item
                  index={index}
                  data-slider-id={id}
                  class={clx(
                    "carousel-item rounded items-baseline",
                    slideStyle.desktop[numSlidesDesktop],
                    slideStyle.mobile[numSlidesMobile],
                  )}
                >
                  <ProductCard
                    product={product}
                    layout={cardLayout}
                    twoColumns={layout?.twoColumns}
                    dontUpdateCartAfter={dontUpdateCartAfter}
                    itemListName={title}
                    platform={platform}
                    index={index}
                    lazyImage
                  />
                </Slider.Item>
              ))}
            </Slider>

            <Show when={!!layout?.showArrows}>
              <div class="absolute -left-4 md:-left-6 top-[calc(50%_-_50px)] -translate-y-1/2 z-10">
                <Slider.PrevButton
                  data-slider-id={id}
                  class="bg-slate-50 border border-gray-200 hover:border-gray-600 w-9 md:w-12 h-9 md:h-12 flex justify-center items-center rounded disabled:opacity-0 shadow-[0_0_26px_rgba(0,0,0,.095)] transition-all"
                >
                  <Icon size={16} id="ChevronLeft" strokeWidth={3} />
                </Slider.PrevButton>
              </div>

              <div class="absolute -right-4 md:-right-6 top-[calc(50%_-_50px)] -translate-y-1/2 z-10">
                <Slider.NextButton
                  data-slider-id={id}
                  class="bg-slate-50 border border-gray-200 hover:border-gray-600 w-9 md:w-12 h-9 md:h-12 flex justify-center items-center rounded disabled:opacity-0 shadow-[0_0_26px_rgba(0,0,0,.095)] transition-all"
                >
                  <Icon size={16} id="ChevronRight" strokeWidth={3} />
                </Slider.NextButton>
              </div>
            </Show>
          </div>

          <Show when={!!layout?.showDots}>
            <ul
              class={`flex justify-center mt-7 col-start-2 row-start-5 gap-x-4 md:gap-x-6 gap-y-6 flex-wrap ${
                products.length > numSlidesMobile ? "" : "hidden"
              } ${products.length > numSlidesDesktop ? "" : "md:hidden"}`}
            >
              {products.map((_, index) => (
                <li
                  key={index}
                  class={clx(
                    "carousel-item hidden leading-[0]",
                    dotStyle.mobile[numSlidesMobile],
                    dotStyle.desktop[numSlidesDesktop],
                  )}
                >
                  <Slider.Dot index={index} data-slider-id={id}>
                    <div class="w-4 md:w-[54px] h-[5px] rounded bg-gray-300 group-disabled:bg-green-800" />
                  </Slider.Dot>
                </li>
              ))}
            </ul>
          </Show>

          <SliderJS rootId={id} hasInsideSlider />
        </div>

        <SendEventOnView
          id={id}
          event={{
            name: "view_item_list",
            params: {
              item_list_name: title,
              items: products.map((product, index) =>
                customMapProductToAnalyticsItem({
                  index,
                  product,
                  ...(useOffer(product.offers)),
                })
              ),
            },
          }}
        />
      </div>
    </div>
  );
}
export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return {
    ...props,
    dontUpdateCartAfter: {
      addItem: ctx.features.dontUpdateCartAfterAddItem ?? false,
    },
  };
};
export default ProductShelf;
