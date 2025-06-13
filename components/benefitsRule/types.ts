import { AvailableIcons } from "../ui/Icon.tsx";

interface Benefit {
  href?: string;
  openInNewTab?: boolean;
  icon: AvailableIcons;
  /** @format rich-text */
  description: string;
}

export interface Props {
  benefits: Benefit[];
  layout?: {
    showArrows?: boolean;
    interval?: number;
  };
}
