import { RequiredKeys } from "../../../../@types/types.ts";
import { ItemActions } from "../../types.ts";

interface ItemGift {
  name: string;
  url?: string;
  image: {
    src: string;
    alt: string;
  };
  itemId: number;
}

export interface Props extends RequiredKeys<ItemActions, "onAddItem"> {
  items: ItemGift[];
}
