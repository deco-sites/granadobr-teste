import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";
import { invoke } from "../../runtime.ts";
import {
  AppliedSellerCode,
  CartWithGW,
} from "site/packs/utils/client/types.ts";
import { effect } from "@preact/signals";
import { state as storeStateApps } from "site/magento/hooks/context.ts";
const { cart: cartApps, wishlist: wishlistApps } = storeStateApps;
import { UPDATE_ALL_STATES } from "../../components/minicart/utils.ts";

export interface Context {
  wishlist: Wishlist | null;
  cart: CartWithGW | null;
  giftItem: ProductsGift | null;
  sellerCode: AppliedSellerCode | null;
}

export interface ReloadProps {
  reloadGiftWrapping?: boolean;
  reloadGift?: boolean;
  reloadCart?: boolean;
  reloadWishlist?: boolean;
}

const loading = signal<boolean>(true);
const disableAddButton = signal<boolean>(false);
const reloadItems = signal<ReloadProps>({
  reloadGiftWrapping: false,
  reloadGift: false,
  reloadCart: false,
  reloadWishlist: false,
});

const context = {
  wishlist: signal<Wishlist | null>(null),
  cart: signal<CartWithGW | null>(null),
  giftItem: signal<ProductsGift | null>(null),
  sellerCode: signal<AppliedSellerCode | null>(null),
};

let queue = Promise.resolve();
let abort = () => {};
const enqueue = (
  cb: (signal: AbortSignal) => Promise<Partial<Context>> | Partial<Context>,
) => {
  abort();

  loading.value = true;
  const controller = new AbortController();

  queue = queue.then(async () => {
    try {
      const { cart, giftItem, sellerCode, wishlist } = await cb(
        controller.signal,
      );

      if (controller.signal.aborted) {
        throw { name: "AbortError" };
      }
      context.cart.value = cart || context.cart.value;
      context.wishlist.value = wishlist || context.wishlist.value;
      context.giftItem.value = giftItem || context.giftItem.value;
      context.sellerCode.value = sellerCode || context.sellerCode.value;

      loading.value = false;
    } catch (error) {
      if (error.name === "AbortError") return;
      loading.value = false;
    }
  });

  abort = () => controller.abort();

  return queue;
};

const load = (signal: AbortSignal) => {
  return invoke(
    {
      cart: [],
      giftItem: [],
      sellerCode: [],
      wishlist: [],
    },
    { signal },
  );
};

const shouldUpdateCart = async () => {
  const { update } = await invoke["site"].loaders.cookies.shouldReloadCart();

  if (update) {
    reloadItems.value = UPDATE_ALL_STATES;
  }
};

const getDataFromStorage = () => {
  const data = localStorage.getItem("wishlist");
  if (!data) return;

  wishlistApps.value = JSON.parse(data);
};

if (IS_BROWSER) {
  /* const reload = await invoke["site"].loaders.cookies
    .expireCookies(); */
  /*   if (reload) {
    globalThis.location.reload();
  }
 */
  getDataFromStorage();

  const features = await invoke[
    "site"
  ].loaders.features.features();

  if (!features.dangerouslyDisableOnLoadUpdate) {
    enqueue(load);
  }

  shouldUpdateCart();

  if (!features.dangerouslyDisableOnVisibilityChangeUpdate) {
    document.addEventListener(
      "visibilitychange",
      () => document.visibilityState === "visible" && enqueue(load),
    );
  }
}

effect(() => {
  globalThis.localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlistApps.value),
  );
});

effect(async () => {
  const { reloadGiftWrapping, reloadGift, reloadCart, reloadWishlist } =
    reloadItems.value;

  try {
    if (reloadCart) {
      const cart = await invoke["magento/loaders/cart"]().then((r) => r);
      cartApps.value = cart;
    }

    if (reloadWishlist) {
      const wishlist = await invoke["magento/loaders/wishlist"]().then((r) =>
        r
      );
      wishlistApps.value = wishlist;
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }

    if (reloadGift) {
      const gifts = await invoke["site"].loaders.giftItem
        .gift()
        .then((r) => r);
      context.giftItem.value = gifts;
    }

    if (reloadGiftWrapping) {
      const wrapping = await invoke[
        "site"
      ].loaders.giftWrapping
        .cart()
        .then((r) => r);
      context.cart.value = wrapping;
    }
  } catch (_error) {
    return;
  }
});

export const state = {
  ...context,
  loading,
  enqueue,
  disableAddButton,
  reloadItems,
};
