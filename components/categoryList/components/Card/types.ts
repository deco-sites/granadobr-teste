import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  label: string;
  description: string;
  image: ImageWidget;
  alt?: string;
}
