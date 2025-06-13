import { ItemAvailability, ProductDetailsPage } from "apps/commerce/types.ts";
import ProductInfo from "site/components/product/ProductInfo.tsx";
import NotFound from "site/sections/Product/NotFound.tsx";
import { ModalProvider } from "site/islands/ModalProvider.tsx";
import ImageGallerySlider from "site/islands/ImageGallerySlider.tsx";
import QuantitySelector from "site/islands/QuantitySelector.tsx";
import ProductDetailsTabs from "site/components/product/ProductDetailsTabs.tsx";
import { useOffer } from "site/sdk/useOffer.ts";
import AddToCart from "site/islands/AddToCart.tsx";
import ShareModal, { ShareButton } from "../../islands/ProductShareModal.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { ReviewsTabTexts } from "site/components/product/ReviewsTab.tsx";
import { ProductTabs } from "site/components/product/ProductDetailsTabs.tsx";
import { SendEventOnLoad } from "../../components/Analytics.tsx";
import { AppContext } from "../../apps/site.ts";
import { type SectionProps } from "@deco/deco";
import WishlistButton from "site/components/wishlist/WishlistButton.tsx";
import { customMapProductToAnalyticsItem } from "site/utils/analytics.ts";
import { PDPAlert } from "site/islands/PDPAlert.tsx";

export interface Props {
  page: ProductDetailsPage | null;
  linkHomeText: string;
  reviewsTabTexts?: ReviewsTabTexts;
  reviewPromptText: string;
  wishlistText?: string;
  addToCartButton: string;
  shareText: {
    shareButtonText?: string;
    shareModalText: string;
  };
  stockText: {
    outOfStockText: string;
    outOfStockNotifyText: string;
  };
  productTabs: ProductTabs;
  notFoundText: string;
}
const formatter = (currency: string, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency });
const formatPrice = (price: number, currency = "BRL", locale = "pt-BR") => {
  return price ? formatter(currency, locale).format(price) : null;
};
export default function ProductDetails({
  page,
  reviewsTabTexts,
  wishlistText,
  shareText,
  stockText,
  productTabs,
  reviewPromptText,
  notFoundText,
  addToCartButton,
  linkHomeText,
  dontUpdateCartAfter,
  isMobile,
}: SectionProps<typeof loader>) {
  if (!page?.seo) {
    return <NotFound />;
  }
  const { product, seo } = page;
  const { canonical } = seo;
  const { offers, productID, sku } = product;
  const { price = 0, availability } = useOffer(offers);
  const currency = "BRL";
  if (!product) {
    return <LoadingFallback />;
  }
  const eventItem = customMapProductToAnalyticsItem({
    product,
    ...useOffer(product.offers),
  });

  return (
    <ModalProvider>
      <nav
        aria-label="Breadcrumb"
        className="hidden text-base font-matria lg:block py-4 md:px-4 lg:px-8 3xl:px-16 mb-4"
      >
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <a
              href="/"
              className="text-[#1D1D1D] font-normal font-matria"
              aria-label="Inicio"
            >
              {linkHomeText}
            </a>
            <span className="mx-2">
              <Icon
                id="ChevronUp"
                strokeWidth={0.01}
                className={`font-normal text-green-800 h-[16px] w-[16px] rotate-90`}
              />
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-[#1D1D1D] font-normal font-matria">
              {seo.title}
            </span>
          </li>
        </ol>
      </nav>
      <div className="block w-screen md:px-4 lg:px-8 3xl:px-16 pb-8 lg:pb-10">
        <div className="grid lg:grid-cols-[55%_45%] grid-rows-1">
          <ImageGallerySlider images={product.image} />
          <div className="flex flex-col justify-center w-full lg:sticky md:top-0 p-4 md:p-16 bg-white h-fit">
            <PDPAlert productId={productID} />
            <ProductInfo
              product={product}
              reviewPromptText={reviewPromptText}
            />

            {/* availability === "https://schema.org/InStock"*/}
            <div className={`w-full`}>
              <div className="w-fit h-full hidden">
                <AddToCart
                  sku={sku}
                  dontUpdateCart={dontUpdateCartAfter.addItem}
                  addToCartButton={addToCartButton}
                  productId={productID}
                  eventParams={{
                    items: [{ ...eventItem, item_id: product.sku }],
                  }}
                />
              </div>
              {availability === "https://schema.org/InStock"
                ? (
                  <>
                    <div className="flex-auto md:flex flex-row justify-center lg:justify-start items-center w-full h-full gap-2">
                      <div className="w-full  md:w-fit h-full flex justify-center md:block">
                        <QuantitySelector />
                      </div>
                      <div className="w-fit h-full hidden md:block">
                        <AddToCart
                          sku={sku}
                          dontUpdateCart={dontUpdateCartAfter.addItem}
                          addToCartButton={addToCartButton}
                          productId={productID}
                          eventParams={{
                            items: [{ ...eventItem, item_id: product.sku }],
                          }}
                        />
                      </div>
                    </div>
                    <hr className="w-full mt-6 hidden md:block md:border-t md:border-gray-300" />
                  </>
                )
                : (
                  <OutOfStock
                    outOfStockText={stockText.outOfStockText}
                    outOfStockNotifyText={stockText.outOfStockNotifyText}
                  />
                )}
            </div>
            <div className="hidden mt-6 md:flex flex-auto justify-between gap-8 lg:justify-start w-full text-sm font-medium">
              {/* <Wishlist wishlistText={wishlistText} /> */}

              <WishlistButton
                productID={productID}
                productGroupID={product.isVariantOf?.productGroupID}
                variant="full"
                wishlistText={wishlistText}
                analyticsItem={{
                  affiliation: "Main Website - Granado - Granado",
                  item_brand: " ",
                  item_id: product.sku,
                  item_name: product.name,
                  item_stock_status:
                    availability === "https://schema.org/InStock"
                      ? "In stock"
                      : "Out stock",
                  price,
                }}
              />

              <ShareButton shareButtonText={shareText.shareButtonText} />
            </div>
          </div>
          <ProductDetailsTabs
            page={page}
            reviews={product.review}
            additionalProperty={product.additionalProperty}
            reviewsTabTexts={reviewsTabTexts}
            productTabs={productTabs}
            notFoundText={notFoundText}
            isMobile={isMobile}
          />
        </div>
        <ShareModal
          canonical={canonical}
          shareModalText={shareText.shareModalText}
        />
        <AddToCartBar
          price={price}
          sku={sku}
          productID={productID}
          dontUpdateCart={dontUpdateCartAfter.addItem}
          availability={availability}
          outOfStockText={stockText.outOfStockText}
          outOfStockNotifyText={stockText.outOfStockNotifyText}
          addToCartButton={addToCartButton}
        />
      </div>
      <SendEventOnLoad
        event={{
          name: "view_item",
          params: {
            currency,
            value: price,
            items: [
              customMapProductToAnalyticsItem({
                product,
                price,
              }),
            ],
          },
        }}
      />
    </ModalProvider>
  );
}
function AddToCartBar(
  {
    price,
    sku,
    dontUpdateCart,
    availability,
    outOfStockText,
    outOfStockNotifyText,
    productID,
    addToCartButton,
  }: {
    price: number;
    sku: string;
    dontUpdateCart: boolean;
    availability?: ItemAvailability;
    outOfStockText: string;
    outOfStockNotifyText: string;
    productID: string;
    addToCartButton: string;
  },
) {
  if (availability !== "https://schema.org/InStock") {
    return (
      <div className="fixed md:hidden w-full h-[50px] z-20 bg-white border-t-[1px] text-xl font-matria border-[#E3E3E3] bottom-[67px]">
        <div className="flex-auto flex flex-row items-center w-full h-full">
          <div className="w-1/2 text-center">{outOfStockText}</div>
          <div className="w-1/2 h-full font-matria text-lg font-light flex justify-center items-center">
            <a
              href="https://www.granado.com.br/granado/customer/account/login/"
              title="Produto fora de estoque"
              className="px-2.5 text-base font-matria font-normal text-center"
            >
              <p className="leading-none">
                {outOfStockNotifyText}
              </p>
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed md:hidden w-full h-[50px] z-20 bg-white border-t-[1px] text-xl font-matria text-[#005239] border-[#E3E3E3] bottom-[67px]">
      <div className="flex-auto flex flex-row items-center w-full h-full">
        <div className="w-1/2 text-center">{formatPrice(price)}</div>
        <div className="w-1/2 h-full font-matria text-lg font-light">
          <AddToCart
            sku={sku}
            dontUpdateCart={dontUpdateCart}
            addToCartButton={addToCartButton}
            productId={productID}
          />
        </div>
      </div>
    </div>
  );
}
export function LoadingFallback() {
  return (
    <div
      style={{ height: "710px" }}
      className="w-full flex justify-center items-center"
    >
      <span className="loading loading-spinner" />
    </div>
  );
}
function OutOfStock({ outOfStockText, outOfStockNotifyText }: {
  outOfStockText: string;
  outOfStockNotifyText: string;
}) {
  return (
    <div className="bg-[#f6f3f8] w-full flex flex-col justify-center items-center">
      <span className="px-4 pt-8 pb-2 mt-4 text-xl font-matria font-medium">
        {outOfStockText}
      </span>
      <a
        href="https://www.granado.com.br/granado/customer/account/login/"
        title="Produto fora de estoque "
        className="px-4 pt-2 pb-8 mb-2.5 text-base font-matria font-normal underline"
      >
        {outOfStockNotifyText}
      </a>
    </div>
  );
}
export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  const isMobile = ctx.device !== "desktop";

  return {
    ...props,
    dontUpdateCartAfter: {
      addItem: ctx.features.dontUpdateCartAfterAddItem ?? false,
    },
    isMobile,
  };
};
