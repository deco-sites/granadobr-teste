import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  alt?: string;
  index: number;
  mobile: ImageWidget;
  openInNewTab?: boolean;
  desktop: ImageWidget;
  preload?: boolean;
  href?: string;
  /**
   * @description id for gtm tracking
   */
  promotionId: string;
}
