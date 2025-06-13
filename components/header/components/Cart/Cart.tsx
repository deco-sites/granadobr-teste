import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { lazy, Suspense } from "preact/compat";
import FallbackLoading from "./components/FallbackLoading/index.tsx";

const CartMagento = lazy(() => import("./platforms/magento/Cart.tsx"));

import { Props } from "./types.ts";

const Cart = (
  { dontUpdateCartAfter, cartType }: Props & { cartType: string },
) => {
  const lazy = useSignal(true);

  useEffect(() => {
    lazy.value = false;
  }, []);

  return (
    <Suspense
      fallback={<FallbackLoading />}
    >
      {!lazy.value
        ? (
          <div className="flex justify-center items-center text-xs font-thin">
            <CartMagento
              dontUpdateCartAfter={dontUpdateCartAfter}
              cartType={cartType}
            />
          </div>
        )
        : <FallbackLoading />}
    </Suspense>
  );
};

export default Cart;
