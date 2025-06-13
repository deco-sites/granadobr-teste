import {
  images,
  offers,
  priceSpecification,
  productGroups as productGroupTable,
  productProperty,
  products,
  properties as propertiesTable,
  PropertyDB,
} from "site/db/schema.ts";
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  InferSelectModel,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { AppContext } from "site/apps/site.ts";
import { AppContext as MagentoContext } from "site/magento/mod.ts";
import {
  FilterToggle,
  FilterToggleValue,
  Offer,
  Product,
  ProductLeaf,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { LibSQLDatabase } from "https://esm.sh/v135/drizzle-orm@0.30.10/libsql/driver.d.ts";

interface FilterToShowItem {
  id: string;
  label: string;
}

/**
 * @title {{key}} - {{value}}
 */
interface FilterParams {
  key: string;
  value: string;
}

interface Props {
  filtersToShow: FilterToShowItem[];
  unavailableThreshold: number;

  /**
   * @default 36
   */
  limit: number;

  /**
   * @default 16
   */
  mobileLimit: number;

  filtersParams: FilterParams[];
}

type ProductDB = InferSelectModel<typeof products>;
type ProductGroupDB = InferSelectModel<typeof productGroupTable>;
type PriceSpecificationDB = InferSelectModel<typeof priceSpecification>;
type OfferDB = InferSelectModel<typeof offers>;

const SORT_OPTIONS = {
  "name:asc": asc(products.name),
  "name:desc": desc(products.name),
  "price:asc": asc(products.lowPrice),
  "price:desc": desc(products.lowPrice),
  "discount": desc(products.discountPercentage),
};

interface GetDBProductsParams {
  records: LibSQLDatabase<Record<string, never>>;
  filtersParams: FilterParams[];
  quantity: number;
  offset: number;
  search?: string;
  sort?: string;
  discount?: string;
  url: string;
}

export default async function loader(
  {
    filtersToShow,
    unavailableThreshold,
    limit = 36,
    mobileLimit = 16,
    filtersParams = [],
  }: Props,
  req: Request,
  ctx: AppContext & MagentoContext,
): Promise<ProductListingPage | null> {
  const records = await ctx.invoke.records.loaders.drizzle();

  const limitToUse = ctx.device === "mobile" ? mobileLimit : limit;

  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") ?? 1);
  url.searchParams.delete("page");

  const offset = (page - 1) * limitToUse;

  const result = await getDBProducts({
    records,
    filtersParams,
    quantity: limitToUse,
    offset,
    url: req.url,
  });

  if (!result) return null;

  const {
    productGroups,
    offersDB,
    imagesData,
    productsDB,
    priceSpecifications,
    properties,
    total,
  } = result;

  const productsInSchema = buildProducts({
    offers: offersDB,
    priceSpecifications,
    productGroups,
    products: productsDB,
    images: imagesData,
    properties,
    unavailableThreshold,
  });

  const filters = toFilters(properties, filtersToShow, filtersParams, req.url);

  const nextPage = new URL(req.url);
  nextPage.searchParams.set("page", String(page + 1));

  const previousPage = new URL(req.url);
  previousPage.searchParams.set("page", String(page - 1));

  productsInSchema;

  return {
    "@type": "ProductListingPage",
    filters,
    products: productsInSchema,
    breadcrumb: {
      itemListElement: [
        {
          "@type": "ListItem",
          item: "Black Friday Granado",
          position: 0,
        },
      ],
      "@type": "BreadcrumbList",
      numberOfItems: 1,
    },
    sortOptions: [{
      label: "Posição",
      value: "",
    }, {
      label: "Nome A-Z",
      value: "name:asc",
    }, {
      label: "Nome Z-A",
      value: "name:desc",
    }, {
      label: "Menor preço",
      value: "price:asc",
    }, {
      label: "Maior preço",
      value: "price:desc",
    }, {
      label: "Desconto",
      value: "discount",
    }],
    pageInfo: {
      currentPage: page,
      nextPage: page * limitToUse < total ? nextPage.href : undefined,
      previousPage: page > 1 ? previousPage.href : undefined,
      records: total,
      recordPerPage: limitToUse,
    },
  };
}

export function buildProducts(
  {
    offers,
    productGroups,
    products,
    priceSpecifications,
    images,
    properties,
    unavailableThreshold,
  }: {
    products: ProductDB[];
    productGroups: ProductGroupDB[];
    offers: OfferDB[];
    priceSpecifications: PriceSpecificationDB[];
    images: any[];
    unavailableThreshold: number;
  },
): Product[] {
  return productGroups.map((pg) => {
    const variants = products.filter((product) =>
      product.inProductGroupWithID == pg.productGroupID
    );

    const variantWithOffers = variants.map((variant): ProductLeaf => {
      const variantOffers = offers.filter((offer) => offer.sku === variant.sku);
      const variantImages = images.filter((image) => image.sku === variant.sku);

      const variantProperties = properties.filter((property) =>
        property.product_property.sku === variant.sku
      ).map(({ properties }) => properties);

      const offersWithPriceSpecifications = variantOffers.map(
        (offer): Offer => {
          const offersPriceSpecifications = priceSpecifications.filter((ps) =>
            ps.offerID === offer.id
          );

          return {
            ...offer,
            priceCurrency: offer.priceCurrency ?? undefined,
            availability: offer.inventoryLevel === unavailableThreshold
              ? "https://schema.org/OutOfStock"
              : offer.availability,
            inventoryLevel: {
              value: offer.inventoryLevel,
            },
            priceSpecification: offersPriceSpecifications.map(
              (priceSpecification) => ({
                "@type": "UnitPriceSpecification",
                ...priceSpecification,
              }),
            ),
          };
        },
      );

      return {
        "@type": "Product",
        ...variant,
        additionalProperty: variantProperties,
        image: variantImages,
        ...(variant.ratingValue && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: variant.ratingValue,
            ratingCount: variant.ratingCount || 0,
            reviewCount: variant.reviewCount || 0,
            bestRating: variant.bestRating || 5,
            worstRating: variant.worstRating || 1,
          },
        }),
        offers: {
          "@type": "AggregateOffer",
          highPrice: variant.highPrice,
          lowPrice: variant.lowPrice,
          offerCount: variant.offerCount,
          priceCurrency: variant.priceCurrency ?? undefined,
          offers: offersWithPriceSpecifications,
        },
      };
    });

    return {
      ...variantWithOffers[0],
      isVariantOf: {
        ...pg,
        hasVariants: variantWithOffers,
      },
    };
  });
}

const toFilters = (
  properties: { properties: PropertyDB }[],
  filtersToShow: FilterToShowItem[] = [],
  filtersParams: Record<string, string>,
  url: string,
) => {
  const filteredItems = filtersToShow.length
    ? properties
      .filter((p) => filtersToShow.some((i) => i.id === p.properties.name))
    : properties;

  const filterObject = Object.values(filteredItems.reduce((acc, current) => {
    const { name, value } = current.properties;
    const key = `${name}-${value}`;
    const filter = acc[key];

    if (!filter) {
      acc[key] = { ...current.properties, quantity: 0 };
    }

    acc[key].quantity += 1;

    return acc;
  }, {} as Record<string, PropertyDB & { quantity: number }>)).reduce(
    (acc, current) => {
      const filter = acc[current.name];

      const currentURL = new URL(url);

      currentURL.searchParams.set(current.name, current.value);

      const filterItem: FilterToggleValue = {
        label: current.value,
        value: current.value,
        quantity: current.quantity,
        url: currentURL.href,
        selected: filtersParams[current.name] === current.value,
      };

      if (!filter) {
        acc[current.name] = {
          "@type": "FilterToggle",
          label: filtersToShow?.find((i) => i.id === current.name)?.label ??
            current.name,
          key: current.name,
          quantity: 1,
          values: [],
        };
      }

      acc[current.name].values.push({
        ...filterItem,
      });

      acc[current.name].quantity += 1;

      return acc;
    },
    {} as Record<string, FilterToggle>,
  );

  const filter = Object.values(filterObject);

  return filter;
};

export async function getDBProducts({
  records,
  filtersParams,
  quantity,
  offset,
  url: reqUrl,
}: GetDBProductsParams): Promise<
  { productGroups: any; offersDB: any; imagesData: any; properties: any } | null
> {
  const url = new URL(reqUrl);

  const search = url.searchParams.get("q");
  url.searchParams.delete("q");

  const sort = url.searchParams.get("sort");
  url.searchParams.delete("sort");

  const discountFilter = filtersParams.find(({ key }) => key === "discount");
  const discount = discountFilter?.value || url.searchParams.get("discount");
  url.searchParams.delete("discount");

  const filteredParams = filtersParams.filter(({ key }) => key !== "discount");

  const filtersObject = Array.from(url.searchParams.entries()).concat(
    filteredParams.map(({ key, value }) => [key, value]),
  ).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]: value,
      };
    },
    {},
  );
  const filters = Object.entries(filtersObject).map(([key, value]) =>
    and(
      eq(propertiesTable.name, key),
      eq(propertiesTable.value, value),
    )
  );

  const filterProperties = await records.select({
    sku: productProperty.sku,
    count: sql<number>`cast(count(${productProperty.propertyID}) as int)`,
  }).from(propertiesTable)
    .where(
      or(
        ...filters,
      ),
    ).innerJoin(
      productProperty,
      eq(productProperty.propertyID, propertiesTable.id),
    ).groupBy(productProperty.sku)
    .having(({ count }) => eq(count, filters.length));

  const productIds = filterProperties.map(({ sku }) => sku!);

  if (filters.length && !productIds.length) return null;

  const result = await records.select({
    product: {
      sku: products.sku,
      inProductGroupWithID: products.inProductGroupWithID,
      discountPercentage: products.discountPercentage,
    },
    total: sql`count(*) over()`,
  })
    .from(products)
    .where(
      and(
        search ? like(products.name, `%${search}%`) : undefined,
        productIds.length ? inArray(products.sku, productIds) : undefined,
        discount
          ? lte(products.discountPercentage, Number(discount))
          : undefined,
      ),
    );

  if (!result.length) return null;

  const allFilteredProductSkus = result.map(({ product }) => product.sku);

  const productsDB = await records.select().from(products).where(
    inArray(products.sku, allFilteredProductSkus),
  )
    .orderBy(SORT_OPTIONS[sort ?? "discount"])
    .limit(quantity)
    .offset(offset);

  const { productGroupsIds, skus } = productsDB.reduce((acc, product) => {
    acc.productGroupsIds.push(product.inProductGroupWithID);
    acc.skus.push(product.sku);

    return acc;
  }, { productGroupsIds: [], skus: [] });

  const [productGroups, offersDB, imagesData, properties] = await Promise.all([
    await records.select().from(productGroupTable).where(
      inArray(productGroupTable.productGroupID, productGroupsIds),
    ),
    await records.select().from(offers).where(inArray(offers.sku, skus)),
    await records.select().from(images).where(inArray(images.sku, skus)),
    await records.select().from(productProperty).where(
      inArray(productProperty.sku, allFilteredProductSkus),
    )
      .innerJoin(
        propertiesTable,
        eq(propertiesTable.id, productProperty.propertyID),
      ),
  ]);

  const offersIds = offersDB.map(({ id }) => id);

  const priceSpecifications = await records.select().from(priceSpecification)
    .where(inArray(priceSpecification.offerID, offersIds));

  const sortedProductGroups = productGroupsIds.map((id) =>
    productGroups.find((group) => group.productGroupID === id)
  );

  return {
    productGroups: sortedProductGroups,
    offersDB,
    imagesData,
    properties,
    productsDB,
    offersIds,
    priceSpecifications,
    total: result[0].total,
  };
}

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props, req: Request) => {
  const url = new URL(req.url);

  url.searchParams.append("limit", String(props.limit));
  url.searchParams.append("mobileLimit", String(props.mobileLimit));
  url.searchParams.append(
    "filterParams",
    props.filtersParams?.reduce((acc, curr) => {
      return `${acc}${curr.key}=${curr.value}&`;
    }, ""),
  );
  url.searchParams.append(
    "unavailableThreshold",
    String(props.unavailableThreshold),
  );

  return url.toString();
};
