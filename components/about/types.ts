import type { ImageWidget } from "apps/admin/widgets.ts";

interface Item {
  label: string;
  htmlFormat?: boolean;
}

interface Layout {
  showDots?: boolean;
  showArrows?: boolean;
}

export interface Props {
  label: string;
  items: Item[];
  image: ImageWidget;
  alt?: string;
  layout: Layout;
}
