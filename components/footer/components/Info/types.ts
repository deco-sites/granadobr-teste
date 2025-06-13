interface Item {
  label: string;
  htmlFormat?: boolean;
}

export interface Info {
  label: string;
  items: Item[];
}

export interface Props {
  content?: Info[];
}
