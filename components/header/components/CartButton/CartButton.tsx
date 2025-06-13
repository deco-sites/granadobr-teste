import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { useUI } from "../../../../sdk/useUI.ts";

import { Props } from "./types.ts";

const CartButton = (
  { loading, forceUpdateCart, items, quantity }: Props,
) => {
  const { displayCart } = useUI();
  const totalItems = quantity || items?.length;

  const onClick = () => {
    displayCart.value = true;
    forceUpdateCart && forceUpdateCart();
  };

  return (
    <button
      id="cart-button"
      title="Sacola"
      disabled={loading}
      class="relative flex items-center justify-center border-none font-matria"
      aria-label="Abrir sacola de compras"
      onClick={onClick}
    >
      <div class="flex flex-col items-center justify-center">
        <div>
          <Icon size={27} id="ShoppingCart" />

          <Show when={totalItems > 0}>
            <span class="absolute -top-1 -right-1 md:-right-[6px] font-medium bg-green-800 text-white text-xs rounded-full h-[18px] w-[18px] flex items-center justify-center">
              {totalItems}
            </span>
          </Show>

          <Show when={loading}>
            <div
              class={`absolute -top-1 -right-1 md:-right-[6px] rounded-full h-[18px] w-[18px] flex items-center justify-center ${
                !totalItems ? "bg-[#81ADA2]" : "bg-white/50"
              }`}
            >
              <span class="loading loading-spinner h-[14px] w-[14px] bg-green-600" />
            </div>
          </Show>
        </div>

        <span class="md:hidden font-normal">Sacola</span>
      </div>
    </button>
  );
};

export default CartButton;
