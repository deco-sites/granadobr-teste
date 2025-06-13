export interface Totalizers {
  subtotal?: number;
  grand_total?: number;
  coupon_code?: string;
  discount_amount?: number;
  shipping_amount?: number;
}

export interface Item {
  sku: string;
  name: string;
  item_id: number;
  price_total: number;
  images?: {
    url?: string;
  }[];
  price: number;
  qty: number;
  url: string;
}

export interface GiftWrappingItem {
  gw_id: number;
  gw_design: {
    label: string;
  };
}

export interface GiftItem {
  name: string;
  entity_id: number;
  image: string;
}

export interface OnRemoveItem {
  index: number;
  isPromoItems?: boolean;
}

export interface onAddItem {
  sku?: string;
  isPromoItems?: boolean;
  itemId: number;
}

export interface OnUpdateQuantity {
  sku?: string;
  quantity: number;
  index: number;
}

export interface OnEstimateShipping {
  postcode: string;
  countryId: string;
}

export interface OnSetShipping {
  postcode: string;
  methodCode: string;
  carrierCode: string;
}

export interface OnManageCoupon {
  couponCode: string;
}

export interface OnManageGiftWrapping {
  gwId: number;
  index: number;
  action: "add" | "remove";
}

interface ShippingRate {
  amount: number;
  method_code: string;
  method_title: string;
  carrier_code: string;
  carrier_title: string;
}

interface StatusCoupon {
  message?: string;
  status?: "success" | "error";
}

export interface ItemActions {
  onAddItem?: ({ sku, itemId, isPromoItems }: onAddItem) => Promise<void>;
  onRemoveItem?: ({ index, isPromoItems }: OnRemoveItem) => Promise<void>;
  onUpdateQuantity?: ({
    quantity,
    index,
    sku,
  }: OnUpdateQuantity) => Promise<void>;
}

export interface CouponActions {
  onManageCoupon?: ({
    couponCode,
  }: OnManageCoupon) => Promise<StatusCoupon | void>;
  onManagePromocode?: ({
    couponCode,
  }: OnManageCoupon) => Promise<StatusCoupon | void>;
}

export interface GiftWrappingActions {
  onManageGiftWrapping?: ({
    gwId,
    index,
    action,
  }: OnManageGiftWrapping) => Promise<void>;
}

export interface ShippingActions {
  onSetShipping?: ({
    postcode,
    methodCode,
    carrierCode,
  }: OnSetShipping) => Promise<void>;
  onEstimateShipping?: ({
    postcode,
    countryId,
  }: OnEstimateShipping) => Promise<ShippingRate[]>;
}
