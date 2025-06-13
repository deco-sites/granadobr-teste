import { ReloadProps } from "../../sdk/hooks/context.ts";

export const UPDATE_ALL_STATES: ReloadProps = {
  reloadGiftWrapping: true,
  reloadGift: true,
  reloadCart: true,
  reloadWishlist: true,
};

export const UPDATE_GIFT: ReloadProps = {
  reloadGift: true,
};

export const UPDATE_CART: ReloadProps = {
  reloadCart: true,
};

export const UPDATE_GW: ReloadProps = {
  reloadGiftWrapping: true,
};

export const UPDATE_WL: ReloadProps = {
  reloadWishlist: true,
};
