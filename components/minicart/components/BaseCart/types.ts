import { AnalyticsItem } from "apps/commerce/types.ts";
import { RequiredKeys } from "../../../../@types/types.ts";

import {
  CouponActions,
  GiftWrappingActions,
  ItemActions,
  ShippingActions,
} from "../../types.ts";

interface GiftWrapping {
  options: {
    id: number;
    label: string;
  }[];
  settings: {
    applied: boolean;
    available: boolean;
    gw_id: number | null;
  };
}

interface GeneralItem {
  name: string;
  url?: string;
  image: {
    src: string;
    alt: string;
  };
}

interface Item extends GeneralItem {
  quantity: number;
  price: {
    sale: number;
    list?: number;
    total?: number;
  };
  giftWrapping?: GiftWrapping;
}

interface ItemGift extends GeneralItem {
  itemId: number;
}

export interface Props extends
  RequiredKeys<
    ItemActions & ShippingActions & CouponActions & GiftWrappingActions,
    "onRemoveItem" | "onUpdateQuantity"
  > {
  items: Item[];
  total: number;
  locale: string;
  coupon?: string;
  loading: boolean;
  itemsQty: number;
  currency: string;
  subtotal: number;
  cartHref: string;
  shipping?: number;
  discounts: number;
  sellerCode?: string;
  checkoutHref: string;
  itemsGift?: ItemGift[];
  freeShippingTarget?: number;
  itemToAnalyticsItem?: (index: number) => AnalyticsItem | null | undefined;
}
