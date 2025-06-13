import { AppContext } from "site/apps/site.ts";
import { AppContext as MagentoContext } from "site/magento/mod.ts";
import {
  offers,
  updateInterval as updateIntervalTable,
} from "site/db/schema.ts";
import { eq, inArray } from "drizzle-orm";
import { SKUs } from "site/loaders/skuList.ts";
import { generateIdempotencyKey } from "site/packs/utils/generatePropsHash.ts";

interface Props {
  skus: SKUs;
  /**
   * @default 10
   */
  stockThreshold?: number;
  /**
   * @default 5
   * @min 5
   * @description Update interval in minutes.
   */
  updateInterval?:
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

export default async function updateLowStockProducts(
  props: Props,
  _req: Request,
  ctx: AppContext & MagentoContext,
) {
  const { stockThreshold = 10, skus, updateInterval = 5 } = props;
  const records = await ctx.invoke.records.loaders.drizzle();

  const intervalMinutes = updateInterval > 5 ? updateInterval : 5;
  const now = new Date();
  const hash = generateIdempotencyKey({
    skus,
    loader: "updateLowStockProducts",
  });

  // Check last update time
  const intervalRow = await records.select().from(updateIntervalTable).where(
    eq(updateIntervalTable.id, hash),
  );

  const { interval } = intervalRow?.[0] ?? {};
  const lastUpdate = interval ? new Date(interval) : null;

  if (
    lastUpdate &&
    now.getTime() - lastUpdate.getTime() < intervalMinutes * 60 * 1000
  ) {
    return [];
  }

  // Update the interval timestamp
  await records.insert(updateIntervalTable).values({
    id: hash,
    interval: now.getTime(),
  }).onConflictDoUpdate({
    target: updateIntervalTable.id,
    set: {
      interval: now.getTime(),
    },
  })
    .catch((e) => console.log("updateIntervalTable", e));

  // Get all products
  const products = await ctx.invoke.magento.loaders.product.list({
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

  // Filter products with low stock
  const lowStockProducts = products?.filter((product) => {
    const inventoryLevel = product.offers?.offers[0]?.inventoryLevel?.value;
    return typeof inventoryLevel === "number" &&
      inventoryLevel <= stockThreshold;
  }) || [];

  const lowStockProductsSkus = lowStockProducts.map((product) => product.sku);

  if (!lowStockProductsSkus.length) {
    return [];
  }

  const offersToUpdate = await records.select().from(offers).where(
    inArray(offers.sku, lowStockProductsSkus),
  );

  await Promise.all(
    offersToUpdate.map(async (offer) => {
      const newInventoryLevel = lowStockProducts.find(
        (product) => product.sku === offer.sku,
      )?.offers[0]?.inventoryLevel?.value;

      await records.update(offers).set({
        inventoryLevel: newInventoryLevel,
      }).where(eq(offers.id, offer.id));
    }),
  );

  return lowStockProducts;
}
