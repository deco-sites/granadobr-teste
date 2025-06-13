import { RequiredKeys } from "../../../../@types/types.ts";
import { GiftWrappingActions } from "../../types.ts";

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

export interface Props
  extends RequiredKeys<GiftWrappingActions, "onManageGiftWrapping"> {
  index: number;
  giftWrapping: GiftWrapping;
}
