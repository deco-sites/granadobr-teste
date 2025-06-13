import {
  AppliedSellerCode,
  CartWithGW,
  GiftBody,
  GiftError,
  GiftSuccess,
  GiftWrapping,
  MagentoProduct,
  ProductsGift,
  RemoveGift,
  ResponseMessage,
  SellerCodeBody,
} from "site/packs/utils/client/types.ts";

import type { API } from "site/magento/utils/client/client.ts";

interface searchParams {
  [key: string]: string | number | undefined | FieldsFilter;
  currencyCode?: string;
  storeId?: number;
  fields?: string;
}

export type FieldsFilter =
  | "url_key"
  | "name"
  | "price"
  | "category_id"
  | "visibility"
  | "status"
  | "type_id"
  | "created_at"
  | "updated_at"
  | "weight"
  | "extension_attributes.website_ids"
  | "extension_attributes.category_links"
  | "extension_attributes.subscription_options"
  | "product_links"
  | "options"
  | "media_gallery_entries"
  | "tier_prices"
  | "custom_attributes";

export interface GranadoAPI extends API {
  /** @docs https://adobe-commerce.redoc.ly/2.4.7-admin/tag/gift-wrappings#operation/GetV1Giftwrappings */
  "GET /rest/:site/V1/gift-wrappings/": {
    response: GiftWrapping;
    searchParams: {
      currentPage: number;
    };
  };
  /** @docs https://adobe-commerce.redoc.ly/2.4.7-admin/tag/gift-wrappingsid#operation/GetV1GiftwrappingsId */
  "GET /rest/:site/V1/gift-wrappings/:id": {
    response: {
      base_price: number;
      desing: string;
      status: number;
    };
  };

  /** @docs https://adobe-commerce.redoc.ly/2.4.7-admin/tag/productssku#operation/GetV1ProductsSku */
  "GET /rest/:site/V1/products/:sku": {
    response: MagentoProduct;
    searchParams: searchParams;
  };

  "POST /rest/:site/V1/gift/quote/:quoteId": {
    response: ResponseMessage;
    body: GiftBody;
  };

  "DELETE /rest/:site/V1/gift/quote/:quoteId/items/:itemId": {
    response: RemoveGift;
  };

  "POST /V1/carts/:cartId/gift-wrapping": {
    body: {
      itemId: string;
      quoteId: string;
      wrappingId: string;
    };
  };

  "POST /rest/all/V1/:site/customapi/giftwrapping": {
    response: GiftSuccess | GiftError;
    body: {
      itemId: string;
      quoteId: string;
      gwId: number;
    };
  };

  "GET /rest/all/V1/:site/customapi/giftwrapping/:quote_id": {
    response: CartWithGW;
  };

  "GET /rest/:site/V1/gift/quote/:quoteId": {
    response: ProductsGift;
  };

  "PUT /rest/all/V1/:site/customapi/giftwrapping/": {
    body: {
      quoteId: string;
      itemId: string;
    };
    response: ResponseMessage;
  };

  "POST /rest/:site/V1/granado/customapi/promolinkpro/": {
    response: ResponseMessage;
    body: SellerCodeBody;
  };

  "GET /rest/:site/V1/granado/customapi/promolinkpro/:quote_id/seller": {
    response: AppliedSellerCode;
  };

  "DELETE /rest/:site/V1/granado/customapi/promolinkpro/": {
    response: ResponseMessage;
    body: SellerCodeBody;
  };
}
