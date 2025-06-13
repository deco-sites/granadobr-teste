// deno-lint-ignore-file no-explicit-any
import { state as storeStateApps } from "site/magento/hooks/context.ts";
import type { Cart } from "site/magento/loaders/cart.ts";
import { Manifest } from "../../manifest.gen.ts";
import { invoke } from "../../runtime.ts";
import { state as storeState } from "./context.ts";

const { sellerCode } = storeState;

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
        { sellerCode: { key, props } },
        {
          signal: storeSignal,
        },
      )
    );

const state = {
  sellerCode,
  loading: storeState.loading || storeStateApps.loading,
  addSellerCode: enqueue("site/actions/addSellerCode.ts"),
  removeSellerCode: enqueue(
    "site/actions/removeSellerCode.ts",
  ),
};

export const useSellerCode = () => state;
