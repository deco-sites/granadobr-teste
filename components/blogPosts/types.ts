import { ImageWidget } from "apps/admin/widgets.ts";

interface Category {
  href: string;
  label: string;
}

interface Post {
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

export interface Props {
  title?: string;
  description?: string;
  posts?: Post[];
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    showArrows?: boolean;
    showDots?: boolean;
  };
}
