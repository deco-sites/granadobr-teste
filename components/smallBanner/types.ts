import type { ImageWidget } from "apps/admin/widgets.ts";

interface Banner {
  desktop: ImageWidget;
  mobile: ImageWidget;
  alt?: string;
  href?: string;
  openInNewTab?: boolean;

  /**
   * @description id for gtm tracking
   */
  promotionId: string;
}

interface Layout {
  showDots?: boolean;
  showArrows?: boolean;
}

export interface Props {
  banners: Banner[];
  layout?: Layout;
  preload?: boolean;
  interval?: number;
}
