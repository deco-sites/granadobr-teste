import { ImageObject } from "apps/commerce/types.ts";

/** @titleBy name */
export interface SiteNavigationElementLeaf {
  /**
   * @ignore
   */
  "@type": "SiteNavigationElement";
  /** An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types. Schema.org tools may have only weaker understanding of extra types, in particular those defined externally. */
  additionalType?: string;
  /** The identifier property represents any kind of identifier for any kind of {@link https://schema.org/Thing Thing}, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See {@link /docs/datamodel.html#identifierBg background notes} for more details. */
  identifier?: string;
  /** An image of the item. This can be a {@link https://schema.org/URL URL} or a fully described {@link https://schema.org/ImageObject ImageObject}. */
  image?: ImageObject[];
  /** The name of the item. */
  name?: string;
  /** URL of the item. */
  url?: string;
}

export interface SiteNavigationElement extends SiteNavigationElementLeaf {
  // TODO: The schema generator is not handling recursive types leading to an infinite loop
  // Lets circunvent this issue by enumerating the max allowed depth
  headerConfig?: {
    displayInHeader: boolean;
    headerOrder: number;
  };

  megamenuConfig?: {
    displayInMegamenu: boolean;
  };

  children?: Array<
    SiteNavigationElementLeaf & {
      children?: Array<
        SiteNavigationElementLeaf & {
          children?: Array<
            SiteNavigationElementLeaf & {
              children?: Array<
                SiteNavigationElementLeaf & {
                  children?: SiteNavigationElementLeaf[];
                }
              >;
            }
          >;
        }
      >;
    }
  >;
}
