import { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

import type { Platform } from "../../apps/site.ts";

import { SendEventOnClick } from "../../components/Analytics.tsx";
import AddToCartButtonMagento from "../../islands/AddToCartButton/magento.tsx";

import Show from "../../directives/Show/index.tsx";
import Hide from "../../directives/Hide/index.tsx";

import { relative } from "../../sdk/url.ts";

import { useOffer } from "../../sdk/useOffer.ts";
import { formatPrice } from "../../sdk/format.ts";
import Slider from "site/components/ui/Slider.tsx";
import SliderJS from "site/islands/SliderJS.tsx";
import WishlistButton from "site/islands/WishlistButton.tsx";
import { customMapProductToAnalyticsItem } from "site/utils/analytics.ts";

export interface Layout {
  cartSaver?: boolean;
  hide?: {
    productLink?: boolean;
    productName?: boolean;
    productDescription?: boolean;
    discount?: boolean;
    new?: boolean;
    favoriteIcon?: boolean;
  };
  onMouseOver?: {
    image?: "Change image" | "Zoom image";
  };
  outOfStock: string;
}

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  layout?: Layout;
  platform?: Platform;

  dontUpdateCartAfter: {
    addItem: boolean;
  };
  twoColumns?: boolean;
  lazyImage?: boolean;
}

const WIDTH = 230;
const HEIGHT = 279;

function ProductCard({
  product,
  twoColumns,
  dontUpdateCartAfter,
  itemListName,
  layout,
  index,
  lazyImage,
}: Props) {
  const {
    url,
    sku,
    productID,
    image: images,
    isVariantOf,
    offers,
    name,
  } = product;

  const id = `product-card-${productID}`;
  const description = product.description || isVariantOf?.description;

  const [front] = images ?? [];
  const { listPrice, price, availability } = useOffer(offers);

  const imagesToShow = images?.slice(0, 3);

  const eventItem = customMapProductToAnalyticsItem({
    product,
    ...useOffer(product.offers),
  });

  const tagValue =
    product.additionalProperty?.find(({ name }) => name === "tag__phebo")
      ?.value ??
      product.isVariantOf?.additionalProperty?.find(({ name }) =>
        name === "tag__phebo"
      )?.value;

  const discountPercentage = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  return (
    <div
      id={id}
      class="flex flex-col border border-gray-200 rounded group w-full h-full text-center font-matria"
      data-deco="view-product"
    >
      <div class="relative">
        <ul class="absolute top-3 left-3 z-10 flex flex-col gap-2 list-none p-0">
          <Show when={!layout?.hide?.discount && discountPercentage > 0}>
            <li class="leading-none bg-purple-100 py-[3px] px-2.5 rounded w-fit shadow-[0_0_26px_rgba(0,0,0,.095)]">
              <span class="text-sm text-gray-950">
                {`- ${discountPercentage}%`}
              </span>
            </li>
          </Show>

          {
            /* <Show when={!layout?.hide?.new && !!tagValue}>
            <li class="leading-none bg-purple-100 py-[3px] px-2.5 rounded w-fit shadow-[0_0_26px_rgba(0,0,0,.095)]">
              <span class="text-sm text-gray-950">
                {tagValue}
              </span>
            </li>
          </Show> */
          }
        </ul>
        <div class="absolute top-3 z-10 right-3">
          <WishlistButton
            productID={productID}
            productGroupID={product.isVariantOf?.productGroupID || ""}
            variant="icon"
            size={24}
            analyticsItem={{
              affiliation: "Main Website - Granado - Granado",
              item_brand: " ",
              item_id: product.sku,
              item_name: product.name || "",
              // @ts-expect-error - Check typing
              item_stock_status: availability === "https://schema.org/InStock"
                ? "In stock"
                : "Out stock",
              price,
            }}
          />
        </div>
        <Show when={!layout?.hide?.productLink}>
          <a
            class="relative block"
            href={url && relative(url)}
            aria-label="Visualizar produto"
          >
            <div
              class="skeleton bg-gray-200 h-full w-full rounded-t rounded-b-none"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            />

            <figure
              class="absolute inset-0 grid overflow-hidden"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            >
              <Slider class="carousel gap-4 col-span-full lg:gap-6 carousel-center">
                {imagesToShow?.map((image, index) => (
                  <Slider.Item
                    index={index}
                    class="rounded items-baseline min-w-full carousel-item flex-auto"
                  >
                    {(image?.url || front.url) && <Image
                      width={WIDTH}
                      src={image?.url ?? front.url}
                      alt={image?.alternateName ?? front.alternateName}
                      class="col-span-full row-span-full transition-opacity rounded-t w-full"
                      sizes="(max-width: 640px) 50vw, 20vw"
                      height={HEIGHT}
                      loading={lazyImage ? "lazy" : "eager"}
                    />}
                  </Slider.Item>
                ))}
              </Slider>
              {
                /* <Image
                width={WIDTH}
                height={HEIGHT}
                src={front.url!}
                alt={front.alternateName}
                class={`col-span-full row-span-full rounded-t w-full ${
                  layout?.onMouseOver?.image == "Zoom image"
                    ? "duration-100 transition-scale scale-100 lg:group-hover:scale-125"
                    : ""
                }`}
                sizes="(max-width: 640px) 50vw, 20vw"
                loading={preload ? "eager" : "lazy"}
                preload={preload}
                decoding="async"
              />

              <Show
                when={!layout?.onMouseOver?.image ||
                  layout?.onMouseOver?.image == "Change image"}
              >
                <Image
                  width={WIDTH}
                  src={back?.url ?? front.url!}
                  alt={back?.alternateName ?? front.alternateName}
                  class="col-span-full row-span-full transition-opacity rounded-t w-full opacity-0 lg:group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, 20vw"
                  decoding="async"
                  height={HEIGHT}
                  loading="lazy"
                />
              </Show> */
              }
            </figure>
          </a>
        </Show>

        <Hide when={!layout?.hide?.productLink}>
          <div
            class="skeleton bg-gray-200 h-full w-full rounded-t rounded-b-none"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          />

          <figure
            class="absolute inset-0 grid overflow-hidden"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          >
            <Slider class="carousel gap-4 col-span-full lg:gap-6 carousel-center">
              {imagesToShow?.map((image, index) => (
                <Slider.Item
                  index={index}
                  class="rounded items-baseline min-w-full carousel-item flex-auto"
                >
                  {(image?.url || front.url) && <Image
                    width={WIDTH}
                    src={image?.url ?? front.url}
                    alt={image?.alternateName ?? front.alternateName}
                    class="col-span-full row-span-full transition-opacity rounded-t w-full"
                    sizes="(max-width: 640px) 50vw, 20vw"
                    decoding="async"
                    height={HEIGHT}
                    loading="lazy"
                    fetchPriority="low"
                  />}
                </Slider.Item>
              ))}
            </Slider>
            {
              /* <Image
              width={WIDTH}
              height={HEIGHT}
              src={front.url!}
              alt={front.alternateName}
              class={`col-span-full row-span-full rounded-t w-full ${
                layout?.onMouseOver?.image == "Zoom image"
                  ? "duration-100 transition-scale scale-100 lg:group-hover:scale-125"
                  : ""
              }`}
              sizes="(max-width: 640px) 50vw, 20vw"
              loading={preload ? "eager" : "lazy"}
              preload={preload}
              decoding="async"
            />

            <Show
              when={!layout?.onMouseOver?.image ||
                layout?.onMouseOver?.image == "Change image"}
            >
              <Image
                width={WIDTH}
                src={back?.url ?? front.url!}
                alt={back?.alternateName ?? front.alternateName}
                class="col-span-full row-span-full transition-opacity rounded-t w-full opacity-0 lg:group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, 20vw"
                decoding="async"
                height={HEIGHT}
                loading="lazy"
              />
            </Show> */
            }
          </figure>
        </Hide>

        {
          /* <Show
          when={!layout?.onMouseOver?.image ||
            layout?.onMouseOver?.image == "Change image"}
        >
          <ul class="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2.5 z-10 hidden lg:flex">
            {new Array(2).fill("").map((_item, index) => (
              <li
                key={index}
                class="h-[5px] w-12 rounded first:bg-gray-600 first:lg:group-hover:bg-gray-200 last:bg-gray-200 last:lg:group-hover:bg-gray-600 transition-colors duration-300"
              />
            ))}
          </ul>
        </Show> */
        }
        <Show
          when={!layout?.onMouseOver?.image ||
            layout?.onMouseOver?.image == "Change image"}
        >
          <ul class="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2.5 z-10 hidden lg:flex">
            {imagesToShow?.map((_item, index) => (
              <Slider.Dot index={index}>
                <li
                  key={index}
                  class="h-[5px] w-12 rounded bg-gray-200 group-disabled:bg-gray-600 transition-colors duration-300"
                />
              </Slider.Dot>
            ))}
          </ul>
        </Show>
      </div>

      <div
        class={`flex flex-col grow p-4 md:px-6 md:pb-6 ${
          twoColumns ? "lg:px-4 xl:px-8" : "lg:px-8"
        }`}
      >
        <Show when={!layout?.hide?.productLink}>
          <a
            href={url && relative(url)}
            aria-label="Visualizar produto"
            class="flex flex-col gap-2 mb-4"
          >
            <Show when={!layout?.hide?.productName && !!name}>
              <span class="text-gray-950 text-base md:text-lg md:leading-6 line-clamp-3">
                {name}
              </span>
            </Show>

            <Show when={!layout?.hide?.productDescription && !!description}>
              <p class="truncate text-sm lg:text-sm text-neutral">
                {description}
              </p>
            </Show>
          </a>
        </Show>

        <Hide when={!layout?.hide?.productLink}>
          <div class="flex flex-col gap-2 mb-4">
            <Show when={!layout?.hide?.productName && !!name}>
              <span class="text-gray-950 text-base md:text-lg md:leading-6 line-clamp-3">
                {name}
              </span>
            </Show>

            <Show when={!layout?.hide?.productDescription && !!description}>
              <p class="truncate text-sm lg:text-sm text-neutral">
                {description}
              </p>
            </Show>
          </div>
        </Hide>

        <div className="flex justify-center items-center gap-2 mt-auto mb-4">
          <Show when={listPrice !== price}>
            <div className="text-[#ABABAB] text-base leading-5 line-through font-normal">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </div>
          </Show>

          <div className="text-xl text-gray-950 leading-[25px] font-normal">
            {formatPrice(price, offers?.priceCurrency)}
          </div>
        </div>

        <Show when={availability === "https://schema.org/InStock"}>
          <AddToCartButtonMagento
            sku={sku}
            productId={productID}
            eventParams={{ items: [{ ...eventItem, item_id: product.sku }] }}
            dontUpdateCart={dontUpdateCartAfter?.addItem}
          />

          {
            /* <a
            href={url && relative(url)}
          >
            <Button
              class="self-center gap-1.5 font-matria font-normal text-lg border-green-800 hover:border-green-800 text-green-800 hover:text-white bg-white hover:bg-green-800 disabled:border-[#30303033] rounded w-full flex-nowrap"
              classLoading="disabled:text-gray-600 disabled:bg-gray-200 disabled:border-0"
              ariaLabel="Adicionar à sacola"
            >
              Comprar
            </Button>
          </a> */
          }
        </Show>

        <Hide when={availability === "https://schema.org/InStock"}>
          <div class="flex justify-center items-center h-12">
            <span class="text-sm md:text-base text-[#666]">
              {layout?.outOfStock ?? "Fora de estoque"}
            </span>
          </div>
        </Hide>
      </div>
      <SliderJS rootId={id} />

      <SendEventOnClick
        id={id}
        event={{
          name: "select_item" as const,
          params: {
            item_list_name: itemListName,
            items: [
              customMapProductToAnalyticsItem({
                product,
                price,
                listPrice,
                index,
              }),
            ],
          },
        }}
      />
    </div>
  );
}

export default ProductCard;
