import { useId } from "../../sdk/useId.ts";
import { Product } from "apps/commerce/types.ts";
import ProductSelector from "./ProductVariantSelector.tsx";
import ProductPricing from "site/components/product/ProductPricing.tsx";
import { ReviewsSummary } from "site/components/product/ReviewsTab.tsx";

export interface Props {
  product: Product;
  layout?: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default product
     */
    name?: "concat" | "productGroup" | "product";
  };
  reviewPromptText: string;
}

function ProductInfo({ product, layout, reviewPromptText }: Props) {
  const id = useId();
  const { name = "", isVariantOf, aggregateRating } = product;

  const formattedName = layout?.name === "concat"
    ? `${isVariantOf?.name} ${name}`
    : layout?.name === "productGroup"
    ? isVariantOf?.name
    : name;

  const ratingValue = aggregateRating?.ratingValue || 0;
  const reviewCount = aggregateRating?.reviewCount || 0;
  return (
    <div
      id={id}
      className={`flex flex-col justify-center lg:justify-start items-center 
        lg:items-start text-center lg:text-left`}
    >
      <div className="flex flex-col w-full">
        <h1 className="font-medium text-[40px] text-green-800 font-granado uppercase">
          {formattedName}
        </h1>
        <div className="flex justify-center lg:justify-start items-center 
        lg:items-start text-center lg:text-left mt-2 text-[16px] font-matria mb-4 md:mb-0">
          {reviewCount > 0
            ? (
              <ReviewsSummary
                rating={ratingValue}
                totalReviews={reviewCount}
                inline
              />
            )
            : (
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-matria text-base font-normal underline"
              >
                {reviewPromptText}
              </a>
            )}
        </div>
      </div>
      <ProductPricing product={product} />

      <div className="mt-4 w-full sm:mt-6">
        <ProductSelector product={product} />
      </div>
    </div>
  );
}

export default ProductInfo;
