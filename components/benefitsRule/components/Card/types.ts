import { AvailableIcons } from "../../../ui/Icon.tsx";

export interface Props {
  href?: string;
  openInNewTab?: boolean;
  icon: AvailableIcons;
  /** @format rich-text */
  description: string;
}
