import { OnManageGiftWrapping } from "../types.ts";

interface ActionsParamsWrapping {
  wrapping_id: number;
  dangerouslyOverrideReturnOnlyStatement?: boolean;
  itemId: string;
}

interface Item {
  item_id: number;
}

export interface UseWrappingProps {
  items: Item[];
  addGiftWrapping: ({
    wrapping_id,
    itemId,
  }: ActionsParamsWrapping) => Promise<void>;
  removeGiftWrapping: ({
    itemId,
  }: Omit<ActionsParamsWrapping, "wrapping_id">) => Promise<void>;
}

export const useWrapping = ({
  items,
  addGiftWrapping,
  removeGiftWrapping,
}: UseWrappingProps) => {
  const onManageGiftWrapping = async ({
    gwId,
    index,
    action,
  }: OnManageGiftWrapping) => {
    const item = items[index];
    const itemId = String(item.item_id);

    action === "add"
      ? await addGiftWrapping({
        itemId,
        wrapping_id: gwId,
        dangerouslyOverrideReturnOnlyStatement: false,
      })
      : await removeGiftWrapping({
        itemId,
        dangerouslyOverrideReturnOnlyStatement: false,
      });
  };

  return {
    onManageGiftWrapping,
  };
};
