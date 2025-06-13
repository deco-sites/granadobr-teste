// deno-lint-ignore-file no-explicit-any
import { Manifest } from "../../manifest.gen.ts";
import { invoke } from "../../runtime.ts";
import { CartWithGW } from "site/packs/utils/client/types.ts";
import { state as storeState } from "./context.ts";

const { cart } = storeState;

type EnqueuableActions<K extends keyof Manifest["actions"]> =
  Manifest["actions"][K]["default"] extends (
    ...args: any[]
  ) => Promise<CartWithGW | null> ? K
    : never;

const enqueue =
  <K extends keyof Manifest["actions"]>(key: EnqueuableActions<K>) =>
  (props: Parameters<Manifest["actions"][K]["default"]>[0]) =>
    storeState.enqueue(
      (signal) => invoke({ cart: { key, props } } as any, { signal }) as any,
    );

const state = {
  cart,
  loading: storeState.loading || storeStateApps.loading,
  addItem: enqueue("site/actions/addGiftWrapping.ts"),
  removeItem: enqueue("site/actions/removeGiftWrapping.ts"),
};

export const useGiftWrapping = () => state;
