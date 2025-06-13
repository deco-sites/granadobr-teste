export interface MagentoProduct {
  id: number;
  sku: string;
  name: string;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight: number;
  url: string;
  extension_attributes: {
    website_ids?: number[];
    category_links: CategoryLink[];
    stock_item?: MagentoStock;
  };
  custom_attributes: CustomAttribute[];
  price_info?: MagentoPriceInfo;
  currency_code?: string;
  images?: MagentoImage[];
  media_gallery_entries?: MediaEntry[];
}

export interface CategoryLink {
  position: number;
  category_id: string;
}

interface MagentoStock {
  item_id: number;
  product_id: number;
  stock_id: number;
  qty?: number;
  is_in_stock?: boolean;
  is_qty_decimal?: boolean;
  show_default_notification_message?: boolean;
  use_config_min_qty?: boolean;
  min_qty?: number;
  use_config_min_sale_qty?: boolean;
  min_sale_qty?: number;
  use_config_max_sale_qty?: boolean;
  max_sale_qty?: number;
  use_config_backorders?: boolean;
  backorders?: number;
  use_config_notify_stock_qty?: boolean;
  notify_stock_qty?: number;
  use_config_qty_increments?: boolean;
  qty_increments?: number;
  use_config_enable_qty_inc?: boolean;
  enable_qty_increments?: boolean;
  use_config_manage_stock?: boolean;
  manage_stock?: boolean;
  low_stock_date?: string | null;
  is_decimal_divided?: boolean;
  stock_status_changed_auto?: number;
}

export interface CustomAttribute {
  attribute_code: string;
  value: string | string[];
}

export interface MagentoPriceInfo {
  final_price: number;
  max_price: number;
  max_regular_price: number;
  minimal_regular_price: number;
  special_price: number | null;
  minimal_price: number;
  regular_price: number;
  formatted_prices: {
    final_price: string;
    max_price: string;
    minimal_price: string;
    max_regular_price: string;
    minimal_regular_price: string | null;
    special_price: string | null;
    regular_price: string;
  };
  extension_attributes: {
    msrp: {
      msrp_price: string;
      is_applicable: string;
      is_shown_price_on_gesture: string;
      msrp_message: string;
      explanation_message: string;
    };
    tax_adjustments: {
      final_price: number;
      max_price: number;
      max_regular_price: number;
      minimal_regular_price: number;
      special_price: number;
      minimal_price: number;
      regular_price: number;
      formatted_prices: {
        final_price: string;
        max_price: string;
        minimal_price: string;
        max_regular_price: string;
        minimal_regular_price: string | null;
        special_price: string;
        regular_price: string;
      };
    };
    weee_attributes: unknown[];
    weee_adjustment: string;
  };
}

interface MagentoImage {
  url: string;
  code: string;
  height: number;
  width: number;
  label: string;
  resized_width: number;
  resized_height: number;
}

interface MediaEntry {
  id: number;
  media_type: string;
  label: string | null;
  position: number;
  disabled: boolean;
  types: string[];
  file: string;
}

export interface Cart {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_virtual: boolean;
  items: MagentoProductsCart[];
  items_count: number;
  items_qty: number;
  customer: {
    email: string | null;
    firstname: string | null;
    lastname: string | null;
  };
  billing_address: {
    id: number;
    region: string | null;
    region_id: string | null;
    region_code: string | null;
    country_id: string | null;
    street: string[];
    telephone: string | null;
    postcode: string | null;
    city: string | null;
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    same_as_billing: number;
    save_in_address_book: number;
  };
  orig_order_id: number;
  currency: {
    global_currency_code: string;
    base_currency_code: string;
    store_currency_code: string;
    quote_currency_code: string;
    store_to_base_rate: number;
    store_to_quote_rate: number;
    base_to_global_rate: number;
    base_to_quote_rate: number;
  };
  customer_is_guest: boolean;
  customer_note_notify: boolean;
  customer_tax_class_id: number;
  store_id: number;
  extension_attributes: {
    shipping_assignments: ShippingAssignment[];
    negotiable_quote: {
      quote_id: number | null;
      is_regular_quote: boolean | null;
      status: string | null;
      negotiated_price_type: string | null;
      negotiated_price_value: number | null;
      shipping_price: number | null;
      quote_name: string | null;
      expiration_period: string | null;
      email_notification_status: number | null;
      has_unconfirmed_changes: boolean | null;
      is_shipping_tax_changed: boolean | null;
      is_customer_price_changed: boolean | null;
      notifications: string | null;
      applied_rule_ids: string | null;
      is_address_draft: boolean | null;
      deleted_sku: string | null;
      creator_id: number | null;
      creator_type: string | null;
    };
  };
}

export interface MagentoProductsCart {
  item_id: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  product_type: string;
  quote_id: string;
}

export interface ShippingAssignment {
  shipping: {
    address: Address;
    method: string | null;
  };
  items: MagentoProductsCart[];
}

export interface Address {
  id: number;
  region: string | null;
  region_id: string | null;
  region_code: string | null;
  country_id: string | null;
  street: string[];
  telephone: string | null;
  postcode: string | null;
  city: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  same_as_billing: number;
  save_in_address_book: number;
}

export interface User {
  customer?: Customer;
  "carbono-customer"?: CarbonoCustomer;
  cart?: CartUser;
}

export interface Customer {
  data_id: number;
  fullname?: string;
  firstname?: string;
}

export interface CarbonoCustomer {
  websiteId?: string;
  email?: string;
  customerId?: string;
  data_id: number;
}

export interface CartUser {
  summary_count: number;
  subtotalAmount: number | null;
  subtotal: string;
  possible_onepage_checkout: boolean;
  items: [];
  isGuestCheckoutAllowed: boolean;
  website_id: string;
  storeId: string;
  adyen_payment_methods: unknown[];
  extra_actions: string;
  cart_empty_message: string;
  subtotal_incl_tax: string;
  subtotal_excl_tax: string;
  mpFSBCartTotal: unknown | null;
  data_id: number;
}

export interface GiftSuccess {
  success: boolean;
  message: string;
}

export interface GiftError {
  message: string;
}

export interface CartWithGW {
  success: boolean;
  message: string;
  designs_info: DesignsInfo[];
  items_info?: ItemsInfo[];
}

export interface DesignsInfo {
  gw_id: number;
  gw_design: GwDesign;
}

export interface GwDesign {
  price: number;
  path: string;
  label: string;
}

export interface ItemsInfo {
  item_id: number;
  item_info: ItemInfo;
}

export interface ItemInfo {
  available: boolean;
  applied: boolean;
  gw_id: number;
}

export interface GiftWrapping {
  items: {
    website_ids: number[];
    wrapping_id: string;
  }[];
}

export interface SellerCodeBody {
  quote_id: number;
  promocode: string;
  type?: string;
}

export interface ResponseMessage {
  success: boolean;
  message: string;
}

interface ProductGift {
  entity_id: number;
  attribute_set_id: number;
  type_id: string;
  sku: string;
  has_options: boolean;
  required_options: boolean;
  created_at: string;
  updated_at: string;
  row_id: number;
  created_in: string;
  updated_in: string;
  mst_search_weight: number;
  name: string;
  small_image: string;
  store_id: number;
  image: string;
}

export interface ProductsGift extends Partial<ResponseMessage> {
  products: ProductGift[];
}

export interface RemoveGift {
  success: boolean;
  message: string;
}

export interface GiftBody {
  isPromoItems: boolean;
  product_id: number;
}

export interface AppliedSellerCode extends Partial<ResponseMessage> {
  seller_promo_code?: string;
}

export interface OverrideFeatures {
  dangerouslyOverrideReturnOnlyStatement?: boolean;
}

export interface ErrorGiftAPI {
  status: number;
  message: string;
}
