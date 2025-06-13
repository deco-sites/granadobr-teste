import { ImageWidget } from "apps/admin/widgets.ts";

interface Category {
  href: string;
  label: string;
}

export interface Props {
  href?: string;
  image: ImageWidget;
  alt?: string;
  categories?: Category[];
  label?: string;
  description?: string;
  author?: string;
  date?: string;
  button?: string;
}
