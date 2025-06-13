import { ImageWidget } from "apps/admin/widgets.ts";

interface Category {
  label: string;
  description: string;
  href?: string;
  image: ImageWidget;
  alt?: string;
}

export interface Props {
  title?: string;
  description?: string;
  categories?: Category[];
  layout?: {
    showArrows?: boolean;
    showDots?: boolean;
  };
  /**
   * @description a unique identifier to use on trigger selectors in GTM
   */
  gtmListId?: string;
}
