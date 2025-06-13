import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { BreadcrumbList, Product } from "apps/commerce/types.ts";
export const customMapProductToAnalyticsItem = ({ product, ...rest }: {
  product: Product;
  breadcrumbList?: BreadcrumbList;
  price?: number;
  listPrice?: number;
  index?: number;
  quantity?: number;
  coupon?: string;
}) => {
  const item = mapProductToAnalyticsItem({ product, ...rest });

  return {
    ...item,
    item_id: product.sku,
  };
};
