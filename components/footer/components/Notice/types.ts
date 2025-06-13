interface Item {
  label: string;
  htmlFormat?: boolean;
}

export interface Notice {
  label: string;
  items: Item[];
}

export interface Props {
  content?: Notice[];
}
