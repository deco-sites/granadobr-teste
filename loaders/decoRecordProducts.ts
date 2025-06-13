import {
  images,
  offers,
  priceSpecification,
  productGroups as productGroupsTable,
  products,
  properties,
  updateInterval as updateIntervalTable,
} from "site/db/schema.ts";
import { eq, InferSelectModel } from "drizzle-orm";
import { generateIdempotencyKey } from "site/packs/utils/generatePropsHash.ts";
import { AppContext } from "site/apps/site.ts";
import { AppContext as MagentoContext } from "site/magento/mod.ts";
import { Product } from "apps/commerce/types.ts";
import { productProperty } from "site/db/schema.ts";
import { SKUs } from "site/loaders/skuList.ts";

interface Props {
  skus: SKUs;
  /**
   * @min 5
   */
  updateInterval:
    | 5
    | 10
    | 15
    | 20
    | 25
    | 30
    | 35
    | 40
    | 45
    | 50
    | 55
    | 60
    | 120
    | 180
    | 240;
}

type ProductDB = InferSelectModel<typeof products>;
type ProductGroupDB = InferSelectModel<typeof productGroupsTable>;
type PriceSpecificationDB = InferSelectModel<typeof priceSpecification>;
type OfferDB = InferSelectModel<typeof offers>;

// Add type for the processed additional properties
type AdditionalProperty = {
  sku: string;
  [key: string]: unknown;
};

const productToDB = (
  product: Product,
): {
  product: ProductDB;
  priceSpecifications: PriceSpecificationDB[];
  productGroup: ProductGroupDB;
  offers: OfferDB[];
  images: { sku: string; [key: string]: unknown }[];
  additionalProperties: AdditionalProperty[];
} => {
  const priceSpecifications: PriceSpecificationDB[] = [];
  const offers: OfferDB[] = [];

  const productGroup = {
    productGroupID: product.isVariantOf?.productGroupID,
    name: product.isVariantOf?.name,
    url: product.isVariantOf?.url,
  };

  const productFormatted = {
    inProductGroupWithID: product.productID,
    ...product,
    lowPrice: product.offers?.lowPrice,
    highPrice: product.offers?.highPrice,
    offerCount: product.offers?.offerCount,
    priceCurrency: product.offers?.priceCurrency,
    discountPercentage: (product.offers?.highPrice - product.offers?.lowPrice) *
      100 / product.offers?.highPrice,
  };

  const images = product.image?.map((image) => ({
    ...image,
    sku: product.sku,
  }));

  const additionalProperties = product.additionalProperty?.map((property) => ({
    ...property,
    sku: product.sku,
  }));

  product.offers?.offers.forEach((o) => {
    const offerID = crypto.randomUUID();

    o.priceSpecification.forEach((ps) =>
      priceSpecifications.push({
        offerID,
        ...ps,
      })
    );

    offers.push({
      id: offerID,
      sku: product.sku,
      availability: o.availability,
      inventoryLevel: o.inventoryLevel.value,
      price: o.price,
      gtin: o.gtin,
      itemCondition: o.itemCondition,
      priceCurrency: o.priceCurrency,
      priceValidUntil: o.priceValidUntil,
      seller: o.seller,
      sellerName: o.sellerName,
    });
  });

  return {
    productGroup,
    product: productFormatted,
    offers,
    priceSpecifications,
    images,
    additionalProperties,
  };
};

export default async function loader(
  { skus, updateInterval }: Props,
  _req: Request,
  ctx: AppContext & MagentoContext,
) {
  const records = await ctx.invoke.records.loaders.drizzle();

  const interval = updateInterval > 5 ? updateInterval : 5;

  const now = new Date();

  const hash = generateIdempotencyKey({ skus, loader: "decoRecordProducts" });

  const intervalRow = await records.select().from(updateIntervalTable).where(
    eq(updateIntervalTable.id, hash),
  );

  const lastUpdate = intervalRow[0]?.interval
    ? new Date(intervalRow[0].interval)
    : null;

  const nowTimestamp = now.getTime();

  const diff = lastUpdate ? nowTimestamp - lastUpdate.getTime() : null;

  if (diff && diff < interval * 60 * 1000) {
    return [];
  }

  const data = await ctx.invoke.magento.loaders.product.list({
    props: {
      pageSize: 50,
      currentPage: 1,
      customFields: {
        active: true,
        overrideList: [
          "fragrancias",
          "fragrancias_str",
          "marca",
          "marca_str",
          "volume",
          "volume_str",
          "familia_olfativa",
          "familia_olfativa_str",
          "linha",
          "linha_str",
          "category_ids",
          "description",
          "google_product_category",
          "tipo_de_pele",
          "tipo_de_pele_str",
          "tipo_de_pelo",
          "tipo_de_pelo_str",
          "como_usar__phebo",
          "ingredientes__phebo",
          "free_shipping__phebo",
          "options_container",
        ],
      },
      sort: {
        sortBy: {
          value: "name",
        },
        order: "ASC",
      },
      skus,
    },
  });

  const dbData = data?.map(productToDB).reduce(
    (
      acc,
      {
        product,
        offers,
        productGroup,
        priceSpecifications,
        images,
        additionalProperties,
      },
    ) => {
      acc.products.push(product);
      acc.offers.push(...offers);
      acc.priceSpecifications.push(...priceSpecifications);
      acc.productGroups.push(productGroup);
      acc.images.push(...images);
      acc.additionalProperties.push(...additionalProperties);
      return acc;
    },
    {
      products: [],
      productGroups: [],
      offers: [],
      priceSpecifications: [],
      images: [],
      additionalProperties: [],
    } as DbDataAccumulator,
  );

  // Fix the reducer accumulator type
  type DbDataAccumulator = {
    products: ProductDB[];
    productGroups: ProductGroupDB[];
    offers: OfferDB[];
    priceSpecifications: PriceSpecificationDB[];
    images: { sku: string; [key: string]: unknown }[];
    additionalProperties: AdditionalProperty[];
  };

  // Fix the additionalProperties reducer type
  type PropertiesAccumulator = {
    additionalProperties: Map<string, Omit<AdditionalProperty, "sku">>;
    skuProperties: Array<{ sku: string; propertyID: string }>;
  };

  const { additionalProperties, skuProperties } = dbData?.additionalProperties
    ?.reduce((acc: PropertiesAccumulator, current) => {
      const { sku, ...property } = current;
      const propertyHash = generateIdempotencyKey(property);

      if (!acc.additionalProperties.has(propertyHash)) {
        acc.additionalProperties.set(propertyHash, property);
      }

      acc.skuProperties.push({
        sku,
        propertyID: propertyHash,
      });

      return acc;
    }, { additionalProperties: new Map(), skuProperties: [] });

  if (dbData) {
    await records.transaction(async (tx) => {
      await tx.insert(updateIntervalTable).values({
        id: hash,
        interval: nowTimestamp,
      })
        .onConflictDoUpdate({
          target: updateIntervalTable.id,
          set: {
            interval: nowTimestamp,
          },
        }).catch((e) => console.error("updateIntervalTable", e));

      await tx.delete(products);

      await tx.insert(productGroupsTable).values(dbData.productGroups)
        .onConflictDoNothing()
        .returning().catch((e) => console.error("productGroupsTable", e));

      await tx.insert(products).values(dbData.products)
        .onConflictDoNothing()
        .returning().catch((e) => console.error("products", e));

      await tx.insert(offers).values(dbData.offers)
        .onConflictDoNothing()
        .returning().catch((e) => console.error("offers", e));

      await tx.insert(priceSpecification).values(
        dbData.priceSpecifications,
      )
        .onConflictDoNothing()
        .returning().catch((e) => console.error("priceSpecification", e));

      await tx.insert(images).values(dbData.images)
        .onConflictDoNothing()
        .returning().catch((e) => console.error("images", e));

      await tx.insert(properties).values(
        Array.from(additionalProperties, ([id, value]) => ({ ...value, id })),
      )
        .onConflictDoNothing()
        .returning().catch((e) => console.error("properties", e));

      await tx.insert(productProperty).values(
        skuProperties,
      )
        .onConflictDoNothing()
        .returning().catch((e) => console.error("productProperty", e));
    });
  }

  return data;
}
