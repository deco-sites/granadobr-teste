import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { InferSelectModel } from "drizzle-orm";

export const cart = sqliteTable("cart", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  json: text("json", { mode: "json" }),
});

export const updateInterval = sqliteTable("update_interval", {
  id: text("id").primaryKey(),
  interval: integer("timestamp").notNull(),
});

// Enums
export const RelationType = {
  SIMILAR: "similar",
  RELATED: "related",
  ACCESSORY: "accessory",
} as const;
export type RelationType = typeof RelationType[keyof typeof RelationType];

export const PriceType = {
  INVOICE_PRICE: "https://schema.org/InvoicePrice",
  LIST_PRICE: "https://schema.org/ListPrice",
  MINIMUM_ADVERTISED_PRICE: "https://schema.org/MinimumAdvertisedPrice",
  MSRP: "https://schema.org/MSRP",
  SALE_PRICE: "https://schema.org/SalePrice",
  SRP: "https://schema.org/SRP",
} as const;
export type PriceType = typeof PriceType[keyof typeof PriceType];

export const ItemCondition = {
  DAMAGED: "https://schema.org/DamagedCondition",
  NEW: "https://schema.org/NewCondition",
  REFURBISHED: "https://schema.org/RefurbishedCondition",
  USED: "https://schema.org/UsedCondition",
} as const;
export type ItemCondition = typeof ItemCondition[keyof typeof ItemCondition];

export const ItemAvailability = {
  BACK_ORDER: "https://schema.org/BackOrder",
  DISCONTINUED: "https://schema.org/Discontinued",
  IN_STOCK: "https://schema.org/InStock",
  IN_STORE_ONLY: "https://schema.org/InStoreOnly",
  LIMITED_AVAILABILITY: "https://schema.org/LimitedAvailability",
  ONLINE_ONLY: "https://schema.org/OnlineOnly",
  OUT_OF_STOCK: "https://schema.org/OutOfStock",
  PRE_ORDER: "https://schema.org/PreOrder",
  PRE_SALE: "https://schema.org/PreSale",
  SOLD_OUT: "https://schema.org/SoldOut",
} as const;
export type ItemAvailability =
  typeof ItemAvailability[keyof typeof ItemAvailability];

// Tables
export const productGroups = sqliteTable("product_groups", {
  productGroupID: text("product_group_id").primaryKey(),
  name: text("name"),
  url: text("url"),
});

export const products = sqliteTable("products", {
  productID: text("product_id").notNull(),
  name: text("name"),
  url: text("url"),
  category: text("category"),
  sku: text("sku").primaryKey(),
  productionDate: text("production_date"),
  releaseDate: text("release_date"),
  gtin: text("gtin"),
  award: text("award"),
  inProductGroupWithID: text("in_product_group_with_id").references(() =>
    productGroups.productGroupID
  ),
  brand: integer("brand"),
  ratingCount: integer("rating_count"),
  reviewCount: integer("review_count"),
  ratingValue: integer("rating_value"),
  bestRating: integer("best_rating"),
  worstRating: integer("worst_rating"),
  ratingExplanation: text("rating_explanation"),
  highPrice: real("high_price"),
  lowPrice: real("low_price"),
  offerCount: integer("offer_count"),
  priceCurrency: text("price_currency"),
  description: text("description"),
  discountPercentage: real("discount_percentage"),
});

export const images = sqliteTable("images", {
  sku: text("sku").references(() => products.sku, { onDelete: "cascade" }),
  url: integer("url"),
  alternateName: integer("alternate_name"),
  encodingFormat: integer("encoding_format"),
});

// export const relatedProducts = sqliteTable("related_products", {
//   productID: text("product_id").references(() => products.productID, {
//     onDelete: "cascade",
//   }),
//   relatedProductID: text("related_product_id").references(
//     () => products.productID,
//     { onDelete: "cascade" },
//   ),
//   relationType: text("relation_type", { enum: Object.values(RelationType) }),
// }, (table) => ({
//   pk: primaryKey({ columns: [table.productID, table.relatedProductID] }),
// }));

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  maxValue: real("max_value"),
  minValue: real("min_value"),
  propertyId: real("property_id"),
  unitCode: text("unit_code"),
  unitText: text("unit_text"),
  valueReference: text("value_reference"),
} //, (table) => ({
  //   pk: primaryKey({ columns: [table.name, table.value] }),
  // })
);

export const productProperty = sqliteTable("product_property", {
  sku: text("sku").references(() => products.sku, { onDelete: "cascade" }),
  propertyID: text("property_id").references(() => properties.id, {
    onDelete: "cascade",
  }),
}, (table) => ({
  pk: primaryKey({ columns: [table.sku, table.propertyID] }),
}));

export const offers = sqliteTable("offers", {
  id: text("id").primaryKey(),
  sku: text("sku").references(() => products.sku, { onDelete: "cascade" }),
  availability: text("availability", { enum: Object.values(ItemAvailability) })
    .notNull(),
  gtin: text("gtin"),
  inventoryLevel: integer("inventory_level").notNull(),
  itemCondition: text("item_condition", { enum: Object.values(ItemCondition) }),
  price: real("price").notNull(),
  priceCurrency: text("price_currency"),
  priceValidUntil: text("price_valid_until"),
  seller: text("seller"),
  sellerName: text("seller_name"),
});

export const priceSpecification = sqliteTable("price_specification", {
  offerID: text("offer_id").references(() => offers.id, {
    onDelete: "cascade",
  }),
  price: real("price").notNull(),
  priceCurrency: text("price_currency"),
  priceType: text("price_type", { enum: Object.values(PriceType) }),
  description: text("description"),
  billingDuration: integer("billing_duration"),
  billingIncrement: real("billing_increment"),
});

// Type inference
export type ProductGroupDB = InferSelectModel<typeof productGroups>;
export type ProductDB = InferSelectModel<typeof products>;
export type ImageDB = InferSelectModel<typeof images>;
// export type RelatedProductDB = InferSelectModel<typeof relatedProducts>;
export type PropertyDB = InferSelectModel<typeof properties>;
export type ProductPropertyDB = InferSelectModel<typeof productProperty>;
export type OfferDB = InferSelectModel<typeof offers>;
export type PriceSpecificationDB = InferSelectModel<typeof priceSpecification>;
