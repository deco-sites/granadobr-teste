import { useWishlist as useWishlistApps } from "site/magento/hooks/useWishlist.ts";
import { state } from "./context.ts";
import { state as storeState } from "site/magento/hooks/context.ts";
import { invoke } from "../../runtime.ts";
import { Manifest } from "../../manifest.gen.ts";
import { Wishlist } from "site/magento/utils/client/types.ts";

const data = useWishlistApps();

type EnqueuableActions<
  K extends keyof Manifest["actions"],
> = Manifest["actions"][K]["default"] extends
  (...args: any[]) => Promise<Wishlist | null> ? K : never;

const enqueue = <
  K extends keyof Manifest["actions"],
>(key: EnqueuableActions<K>) =>
(props: Parameters<Manifest["actions"][K]["default"]>[0]) =>
  storeState.enqueue((signal) =>
    invoke({ wishlist: { key, props } } as any, { signal }) as any
  );

export const useWishlist = () => ({
  wishlist: state.wishlist,
  ...data,
  removeItem: enqueue("site/loaders/removeWishlist.ts"),
});
