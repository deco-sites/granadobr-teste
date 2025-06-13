import { Suspense } from "preact/compat";

import Drawer from "../../../../components/ui/Drawer.tsx";
import Cart from "../../../../components/minicart/index.tsx";

import { useUI } from "../../../../sdk/useUI.ts";
import { Props } from "./types.ts";

const CartSide = ({ children, freeShippingTarget, cartType }: Props) => {
  const { displayCart, displayRemoveProductModal } = useUI();

  return (
    <Drawer
      class="drawer-end"
      open={displayCart.value !== false}
      onClose={() => {
        if (!displayRemoveProductModal.value) {
          displayCart.value = false;
        }
      }}
      aside={
        <div
          class={`bg-white h-full max-w-[100vw] ${
            displayCart.value && "shadow-[0_0_12px_2px_rgba(0,0,0,.35)]"
          }`}
        >
          <Suspense
            fallback={
              <div class="w-screen flex items-center justify-center">
                <span class="loading loading-ring" />
              </div>
            }
          >
            {<Cart freeShippingTarget={freeShippingTarget} />}
          </Suspense>
        </div>
      }
    >
      {children}
    </Drawer>
  );
};

export default CartSide;
