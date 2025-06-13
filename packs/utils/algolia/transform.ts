import { Offer, Product, PropertyValue } from "apps/commerce/types.ts";
import { Categories, Facet, ProductFromAlgolia } from "./types.ts";
import { IN_STOCK, OUT_OF_STOCK } from "../constants.ts";
import { Filter } from "apps/commerce/types.ts";

export const toProduct = (
  { product, options }: {
    product: ProductFromAlgolia;
    options: { currencyCode?: string; url?: string };
  },
): Product => {
  const offers = toOffer(product);
  const sku = product.sku;
  const productID = product.objectID;
  const { default: productPrice, default_original_formated: highPriceStr } =
    product.price[options.currencyCode ?? "BRL"];
  const productUrl = options?.url?.length
    ? `${options.url}${new URL(product.url).pathname}`
    : product.url;

  const additionalProperty: PropertyValue[] = toAdditionalProperty(product);

  return {
    "@type": "Product",
    productID,
    sku,
    url: productUrl,
    name: product.name.trim(),
    gtin: sku,
    aggregateRating: {
      "@type": "AggregateRating",
      reviewCount: product.rating_summary,
    },
    isVariantOf: {
      "@type": "ProductGroup",
      productGroupID: productID,
      url: productUrl,
      name: product.name.trim(),
      model: "",
      additionalProperty: additionalProperty,
      hasVariant: [
        {
          "@type": "Product",
          productID,
          sku,
          url: productUrl,
          name: product.name.trim(),
          gtin: sku,
          offers: {
            "@type": "AggregateOffer",
            highPrice: productPrice,
            lowPrice: productPrice,
            offerCount: offers.length,
            offers: offers,
          },
        },
      ],
    },
    additionalProperty: additionalProperty,
    image: toImages(product),
    offers: {
      "@type": "AggregateOffer",
      highPrice: highPriceStr
        ? parseFloat(
          highPriceStr.replace(/[^\d,]/g, "").replace(",", "."),
        )
        : productPrice,
      lowPrice: productPrice,
      offerCount: offers.length,
      offers: offers,
    },
  };
};

export const toOffer = (
  product: ProductFromAlgolia,
  currencyCode = "BRL",
): Offer[] => {
  const { default: productPrice, default_original_formated: highPriceStr } =
    product.price[currencyCode];
  return [{
    "@type": "Offer",
    availability: product?.in_stock ? IN_STOCK : OUT_OF_STOCK,
    inventoryLevel: {
      value: product?.ordered_qty,
    },
    itemCondition: "https://schema.org/NewCondition",
    price: product.price[currencyCode].default,
    priceCurrency: currencyCode,
    priceSpecification: [
      {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/ListPrice",
        price: highPriceStr
          ? parseFloat(
            highPriceStr.replace(/[^\d,]/g, "").replace(",", "."),
          )
          : productPrice,
      },
      {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/SalePrice",
        price: productPrice,
      },
    ],
    sku: product.sku,
  }];
};

export const toImages = (product: ProductFromAlgolia) => {
  return product.media_gallery?.map((img) => ({
    "@type": "ImageObject" as const,
    encodingFormat: "image",
    alternateName: img,
    url: img,
  }));
};

export const toAdditionalProperty = (
  product: ProductFromAlgolia,
): PropertyValue[] => {
  const defaultProperties: PropertyValue[] = [{
    "@type": "PropertyValue",
    name: "visibilitySearch",
    value: String(product.visibility_search),
  }, {
    "@type": "PropertyValue",
    name: "visibility_catalog",
    value: String(product.visibility_catalog),
  }, {
    "@type": "PropertyValue",
    name: "volume",
    value: String(product.volume),
  }, {
    "@type": "PropertyValue",
    name: "marca",
    value: String(product.marca),
  }, {
    "@type": "PropertyValue",
    name: "categoryIds",
    value: String(product.categoryIds),
  }];

  if (product?.tag__phebo) {
    defaultProperties.push({
      "@type": "PropertyValue",
      "name": "tag__phebo",
      "value": product.tag__phebo,
    });
  }

  return [
    ...defaultProperties,
    ...categoriesMap(product.categories),
  ];
};

function categoriesMap(categories: Categories): PropertyValue[] {
  const results: PropertyValue[] = [];

  for (const level of Object.keys(categories)) {
    const value = categories[level].join(", ");
    const result: PropertyValue = {
      "@type": "PropertyValue",
      name: `categories ${level}`,
      value: value,
    };
    results.push(result);
  }
  return results;
}

export const getPageInfo = (
  page: number,
  nbPages: number,
  nbHits: number,
  hitsPerPage: number,
  url: URL,
  startingPage: number,
) => {
  const next = page + 1;
  const prev = page - 1;
  const hasNextPage = next < nbPages;
  const hasPreviousPage = prev >= 0;
  const nextPage = new URLSearchParams(url.searchParams);
  const previousPage = new URLSearchParams(url.searchParams);

  if (hasNextPage) {
    nextPage.set("page", `${next + startingPage}`);
  }

  if (hasPreviousPage) {
    previousPage.set("page", `${prev + startingPage}`);
  }

  return {
    nextPage: hasNextPage ? `?${nextPage}` : undefined,
    previousPage: hasPreviousPage ? `?${previousPage}` : undefined,
    records: nbHits,
    recordPerPage: hitsPerPage,
    currentPage: page + startingPage,
  };
};

// Transforms facets and re-orders so they match what's configured on deco admin
export const transformFacets = (
  facets: Record<string, Record<string, number>>,
  options: { order: Facet[]; facetFilters: [string, string[]][]; url: URL },
): Filter[] => {
  const { facetFilters, url, order } = options;
  const params = new URLSearchParams(url.searchParams);
  const filters = Object.fromEntries(facetFilters);
  const orderByKey = new Map(
    order.map(({ name, label }, index) => [name, { label, index }]),
  );
  const entries = Object.entries(facets);

  const transformed: Filter[] = new Array(entries.length);
  for (let it = 0; it < entries.length; it++) {
    const [key, values] = entries[it];
    const filter = filters[key] ?? [];
    let index: number | undefined = it;
    let label: string | undefined = key;

    // Apply sort only when user set facets on deco admin
    if (orderByKey.size > 0) {
      index = orderByKey.get(key)?.index;
      label = orderByKey.get(key)?.label;
    }

    if (index === undefined || label === undefined) continue;

    transformed[index] = {
      "@type": "FilterToggle",
      quantity: 0,
      label,
      key,
      values: Object.entries(values).map(([value, quantity]) => {
        const index = filter.findIndex((f) => f === value);
        const selected = index > -1;
        const newFilter = selected
          ? {
            ...filters,
            [key]: [...filter].filter((f) => f !== value),
          }
          : {
            ...filters,
            [key]: [...filter, value],
          };

        if (newFilter[key].length === 0) {
          delete newFilter[key];
        }

        params.set("facetFilters", JSON.stringify(Object.entries(newFilter)));
        params.delete("page");

        return {
          value,
          quantity,
          label: value,
          selected,
          url: `?${params}`,
        };
      }),
    };
  }

  return transformed.filter(Boolean);
};
