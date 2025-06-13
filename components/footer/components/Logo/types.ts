import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Logo {
  image: ImageWidget;
  alt?: string;
}

export interface Props {
  content?: Logo;
}
