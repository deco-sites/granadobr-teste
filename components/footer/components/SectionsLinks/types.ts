interface Item {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface Section {
  label: string;
  items: Item[];
}

export interface Props {
  content: Section[];
}
