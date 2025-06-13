import { AnalyticsItem } from "apps/commerce/types.ts";
import { GiftWrappingActions, ItemActions } from "../../types.ts";

interface GiftWrapping {
  options: {
    id: number;
    label: string;
  }[];
  settings: {
    applied: boolean;
    available: boolean;
    gw_id: number | null;
  };
}

interface Item {
  image: {
    src: string;
    alt: string;
  };
  url?: string;
  name: string;
  quantity: number;
  price: {
    sale: number;
    list?: number;
    total?: number;
  };
  giftWrapping?: GiftWrapping;
}

export interface Props
  extends GiftWrappingActions, Omit<ItemActions, "onRemoveItem" | "onAddItem"> {
  item: Item;
  currency: string;
  itemToAnalyticsItem?: (index: number) => AnalyticsItem | null | undefined;
  onRemoveItem: ({ index }: { index: number }) => void;
  locale: string;
  index: number;
}
