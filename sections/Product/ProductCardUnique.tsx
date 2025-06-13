import { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Header from "site/components/ui/SectionHeader.tsx";
import Slider from "site/components/ui/Slider.tsx";
import WishlistButton from "site/islands/WishlistButton.tsx";
import { customMapProductToAnalyticsItem } from "site/utils/analytics.ts";
import { SendEventOnClick } from "../../components/Analytics.tsx";
import Hide from "../../directives/Hide/index.tsx";
import Show from "../../directives/Show/index.tsx";
import AddToCartButtonMagento from "../../islands/AddToCartButton/magento.tsx";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";

export type cardLayout = {
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
};

export interface Props {
  products: Product[] | null;
  title?: string;
  description?: string;
  /**
   * @description a unique identifier to use on trigger selectors in GTM
   */
  gtmListId?: string;
  cardLayout?: cardLayout;
}

const WIDTH = 230;
const HEIGHT = 279;

const HorizontalProductCard = ({
  product,
  index,
  cardLayout,
  gtmListId,
}: {
  product: Product;
  index: number;
  cardLayout?: cardLayout;
  gtmListId?: string;
}) => {
  const {
    url,
    sku,
    productID,
    image: images,
    offers,
  } = product;

  const id = `product-card-${productID}`;

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
      key={productID}
      id={id}
      className="flex flex-col md:flex-row border border-gray-200 bg-white rounded group w-full h-full items-center text-center font-matria"
      data-deco="view-product"
    >
      <div className="relative w-full md:w-1/3">
        <ul className="absolute top-3 left-3 z-10 flex flex-col gap-2 list-none p-0">
          <Show
            when={!cardLayout?.hide?.discount && discountPercentage > 0}
          >
            <li className="leading-none bg-purple-100 py-[3px] px-2.5 rounded w-fit shadow-[0_0_26px_rgba(0,0,0,.095)]">
              <span className="text-sm text-gray-950">
                {`- ${discountPercentage}%`}
              </span>
            </li>
          </Show>

          <Show when={!cardLayout?.hide?.new && !!tagValue}>
            <li className="leading-none bg-purple-100 py-[3px] px-2.5 rounded w-fit shadow-[0_0_26px_rgba(0,0,0,.095)]">
              <span className="text-sm text-gray-950">
                {tagValue}
              </span>
            </li>
          </Show>
        </ul>

        <div className="absolute top-3 z-10 right-3">
          <WishlistButton
            productID={productID}
            productGroupID={product.isVariantOf?.productGroupID ?? productID}
            variant="icon"
            size={24}
            analyticsItem={{
              affiliation: "Main Website - Granado - Granado",
              item_brand: " ",
              item_id: product.sku,
              item_name: product.name ?? "",
              item_stock_status: availability === "https://schema.org/InStock"
                ? "In stock"
                : "Out stock",
              price,
            }}
          />
        </div>

        <Show when={!cardLayout?.hide?.productLink}>
          <a
            className="relative block"
            href={url && relative(url)}
            aria-label="Visualizar produto"
          >
            <div
              className="skeleton bg-gray-200 h-full w-full rounded-t rounded-b-none"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            />

            <figure
              className="absolute inset-0 grid overflow-hidden"
              style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            >
              <Slider className="carousel gap-4 col-span-full lg:gap-6 carousel-center">
                {imagesToShow?.map((image, idx) => (
                  <Slider.Item
                    index={idx}
                    key={idx}
                    className="rounded items-baseline min-w-full carousel-item flex-auto"
                  >
                    <Image
                      width={WIDTH}
                      src={image?.url ?? front.url!}
                      alt={image?.alternateName ?? front.alternateName}
                      className="col-span-full row-span-full transition-opacity rounded-t w-full"
                      sizes="(max-width: 640px) 50vw, 20vw"
                      decoding="async"
                      height={HEIGHT}
                      loading="lazy"
                    />
                  </Slider.Item>
                ))}
              </Slider>
            </figure>
          </a>
        </Show>

        <Show
          when={!cardLayout?.onMouseOver?.image ||
            cardLayout?.onMouseOver?.image == "Change image"}
        >
          <ul className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2.5 z-10 hidden lg:flex">
            {imagesToShow?.map((_item, idx) => (
              <Slider.Dot index={idx} key={idx}>
                <li className="h-[5px] w-12 rounded bg-gray-200 group-disabled:bg-gray-600 transition-colors duration-300" />
              </Slider.Dot>
            ))}
          </ul>
        </Show>
      </div>

      <div className="flex flex-col grow p-4 md:px-6 md:pb-6 lg:px-8 order-last md:order-none">
        <div className="flex justify-center items-center gap-2 mt-auto mb-4">
          <Show when={listPrice !== price}>
            <div className="text-[#ABABAB] text-base leading-5 line-through font-normal">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </div>
          </Show>

          <div className="text-2xl text-green-800 leading-[25px] font-bold">
            {formatPrice(price, offers?.priceCurrency)}
          </div>
        </div>

        <Show when={availability === "https://schema.org/InStock"}>
          <div className="grid grid-cols-2 gap-2">
            <AddToCartButtonMagento
              sku={sku}
              productId={productID}
              eventParams={{
                items: [{ ...eventItem, item_id: product.sku }],
              }}
              dontUpdateCart={false}
            />
            <a
              href={url && relative(url)}
              className="text-sm text-green-800 border border-green-800 px-4 py-2 flex justify-center items-center"
            >
              Ver detalhes
            </a>
          </div>
        </Show>

        <Hide when={availability === "https://schema.org/InStock"}>
          <div className="flex justify-center items-center h-12">
            <span className="text-sm md:text-base text-[#666]">
              {cardLayout?.outOfStock ?? "Fora de estoque"}
            </span>
          </div>
        </Hide>
      </div>

      <div className="w-full md:w-1/3 p-4">
        <p className="text-sm text-gray-950">
          Frete grátis na entrega do Box Granado
        </p>
        <a
          href="https://mcstaging.granado.com.br/regulamento-box-granado"
          className="text-sm text-gray-950 underline"
        >
          Leia o regulamento
        </a>
      </div>

      <SendEventOnClick
        id={id}
        event={{
          name: "select_item" as const,
          params: {
            item_list_name: gtmListId,
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
};

export default function ProductCardUnique({
  products,
  title,
  description,
  gtmListId,
  cardLayout,
}: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full container px-4 py-8 gap-8 lg:gap-10 lg:py-10 lg:px-40 bg-gray-100 ">
      <Header
        title={title}
        description={description}
        alignment="center"
      />

      <div className="grid grid-cols-1 gap-4">
        {products.slice(0, 1).map((product, index) => (
          <HorizontalProductCard
            product={product}
            index={index}
            cardLayout={cardLayout}
            gtmListId={gtmListId}
          />
        ))}
      </div>
    </div>
  );
}
