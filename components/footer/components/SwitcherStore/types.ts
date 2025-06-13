export interface SwitcherItem {
  label: "Granado" | "Phebo" | "Care";
  href?: string;
  openInNewTab?: boolean;
}

export interface Props {
  content?: SwitcherItem[];
}
