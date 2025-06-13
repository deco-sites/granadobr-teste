import { state } from "../../../sdk/hooks/context.ts";
import {
  UPDATE_ALL_STATES,
  UPDATE_CART,
  UPDATE_GIFT,
  UPDATE_GW,
} from "../utils.ts";

import { onAddItem, OnRemoveItem, OnUpdateQuantity } from "../types.ts";

interface ActionsParams {
  qty: number;
  sku: string;
  itemId: string;
}

interface ActionsParamsGift {
  giftId: number;
  isPromoItems: boolean;
  dangerouslyOverrideReturnOnlyStatement?: boolean;
}

interface Item {
  sku: string;
  item_id: number;
}

interface UseProductProps {
  items: Item[];
  updateItem: ({
    qty,
    itemId,
    sku,
  }: ActionsParams) => Promise<void>;
  removeGiftItem: ({
    giftId,
  }: Omit<ActionsParamsGift, "isPromoItems">) => Promise<void>;
  addItem: ({
    sku,
    productId,
    qty,
  }: Omit<ActionsParams, "itemId"> & { productId: string }) => Promise<void>;
  addGiftItem: ({ giftId, isPromoItems }: ActionsParamsGift) => Promise<void>;
  removeItem: ({ itemId }: Omit<ActionsParams, "qty" | "sku">) => Promise<void>;
}

export const useProduct = ({
  items,
  updateItem,
  removeGiftItem,
  addGiftItem,
  removeItem,
  addItem,
}: UseProductProps) => {
  const { reloadItems } = state;

  const onUpdateQuantity = async ({ quantity, index }: OnUpdateQuantity) => {
    const item = items[index];
    const itemId = String(item.item_id);

    await updateItem({
      itemId,
      qty: quantity,
      sku: item.sku,
    });

    reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_CART };
  };

  const onRemoveItem = async ({
    index,
    isPromoItems = false,
  }: OnRemoveItem) => {
    const item = items[index];
    const itemId = item.item_id;

    if (isPromoItems) {
      await removeGiftItem({
        giftId: itemId,
      });

      reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW, ...UPDATE_CART };
      return;
    }

    await removeItem({
      itemId: String(itemId),
    });

    reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW, ...UPDATE_CART };
  };

  const onAddItem = async ({
    sku,
    itemId,
    isPromoItems = false,
  }: onAddItem) => {
    if (isPromoItems) {
      await addGiftItem({
        giftId: itemId,
        isPromoItems,
      });

      reloadItems.value = UPDATE_ALL_STATES;
      return;
    }

    await addItem({
      productId: String(itemId),
      sku: sku || "0",
      qty: 1,
    });

    reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW, ...UPDATE_CART };
  };

  return {
    onAddItem,
    onRemoveItem,
    onUpdateQuantity,
  };
};
