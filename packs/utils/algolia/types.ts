export interface Categories {
  [key: string]: string[];
}

interface Price {
  [key: string]: currencyCode;
}

interface currencyCode {
  default: number;
  default_formated: string;
  special_from_date: string;
  special_to_date: string;
  default_original_formated?: string;
}

interface HighlightResult {
  name: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  ordered_qty_7: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  ordered_qty_30: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  ordered_qty_90: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  rating_summary: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  categories: Categories;
  categories_without_path: string[];
  media_gallery: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  }[];
  in_stock: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  sku: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  price: {
    BRL: {
      default: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      default_formated: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      special_from_date: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      special_to_date: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
  };
  free_shipping__phebo: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  meta_keyword: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  linha: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  fragrancias: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  created_at: {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
}

export interface ProductFromAlgolia {
  name: string;
  url: string;
  visibility_search: number;
  visibility_catalog: number;
  type_id: string;
  ordered_qty: number;
  ordered_qty_7: number;
  ordered_qty_30: number;
  ordered_qty_90: number;
  rating_summary: number;
  categories: Categories;
  categories_without_path: string[];
  categoryIds: string[];
  thumbnail_url: string;
  image_url: string;
  media_gallery: string[];
  in_stock: number;
  sku: string;
  price: Price;
  free_shipping__phebo: number;
  tag__phebo?: string;
  meta_keyword: string;
  linha: string;
  fragrancias: string;
  created_at: string;
  marca: string;
  volume: string;
  algoliaLastUpdateAtCET: string;
  objectID: string;
  _highlightResult: HighlightResult;
}

export interface CategoryHit {
  slug: string;
  name: string;
  url: string;
  _tags?: string;
  path?: string;
  content: string;
  algoliaLastUpdateAtCET: string;
  objectID: string;
  _snippetResult: {
    content: {
      value: string;
      matchLevel: string;
    };
  };
  _highlightResult: {
    slug: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    name: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    content: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
    meta_title: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
    meta_description: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
  };
}

export interface PageHit {
  _tags?: string;
  path?: string;
  slug: string;
  name: string;
  url: string;
  content: string;
  algoliaLastUpdateAtCET: string;
  objectID: string;
  _snippetResult: {
    content: {
      value: string;
      matchLevel: string;
    };
  };
  _highlightResult: {
    slug: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    name: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    content: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
  };
}

export interface IndexedSuggestion<T> {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  query: string;
  params: string;
  index: string;
  processingTimeMS: number;
  processingTimingsMS: {
    _request: {
      roundTrip: number;
    };
    extensions: number;
    total: number;
  };
  serverTimeMS: number;
}

/** @titleBy label */
export interface Facet {
  /**
   * @title Facet Name
   * @description These are the facet names available at Algolia dashboard > search > index */
  name: string;

  /** @description Facet label to be rendered on the site UI */
  label: string;
}
