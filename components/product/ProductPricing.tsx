import { formatPrice } from "site/sdk/format.ts";
import { Product } from "apps/commerce/types.ts";
import { useOffer } from "site/sdk/useOffer.ts";

interface Props {
  product: Product;
}

function ProductPricing({ product }: Props) {
  const { offers } = product;
  const { price = 0, listPrice, installments } = useOffer(offers);

  return (
    <div class="w-full contents">
      <div class="mb-4 md:my-4 flex flex-col">
        {(listPrice ?? 0) > price && (
          <span class="line-through text-black text-xst ext-secondary">
            {formatPrice(listPrice, offers?.priceCurrency)}
          </span>
        )}
        <span class="font-medium text-[32px] text-[#005239] font-granado">
          {formatPrice(price, offers?.priceCurrency)}
        </span>
      </div>
      <span class="text-[18px] font-matria text-black">{installments}</span>
    </div>
  );
}

export default ProductPricing;
