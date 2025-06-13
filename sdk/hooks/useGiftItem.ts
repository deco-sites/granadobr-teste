// deno-lint-ignore-file no-explicit-any
import { Manifest } from "../../manifest.gen.ts";
import { invoke } from "../../runtime.ts";
import { state as storeStateApps } from "site/magento/hooks/context.ts";
import { state as storeState } from "./context.ts";
import type { Cart } from "site/magento/loaders/cart.ts";

const { giftItem } = storeState;

type EnqueuableActions<K extends keyof Manifest["actions"]> =
  Manifest["actions"][K]["default"] extends (
    ...args: any[]
  ) => Promise<Cart | null> ? K
    : never;

const enqueue =
  <K extends keyof Manifest["actions"]>(key: EnqueuableActions<K>) =>
  (props: Parameters<Manifest["actions"][K]["default"]>[0]) =>
    storeState.enqueue((storeSignal) =>
      invoke(
        { giftItem: { key, props } },
        {
          signal: storeSignal,
        },
      )
    );

const state = {
  giftItem,
  loading: storeState.loading || storeStateApps.loading,
  addGiftItem: enqueue("site/actions/addGiftItem.ts"),
  removeGiftItem: enqueue("site/actions/removeGiftItem.ts"),
};

export const useGiftItem = () => state;
