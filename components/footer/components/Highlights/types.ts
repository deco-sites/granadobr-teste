export interface Highlights {
  type: "Storefront" | "WhatsApp";
  label: string;
  description: string;
  href: string;
  openInNewTab?: boolean;
}

export interface Props {
  content?: Highlights[];
}
