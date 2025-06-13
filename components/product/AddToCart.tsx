import { useSignal } from "@preact/signals";
import { useCart } from "site/sdk/hooks/useCart.ts";

import Icon from "../../components/ui/Icon.tsx";
import { useModal } from "../../islands/ModalProvider.tsx";

import { useToast } from "../../sdk/useToast.ts";
import { useForceUpdateCart } from "../../sdk/useForceUpdateCart.ts";

import { state } from "../../sdk/hooks/context.ts";
import { UPDATE_GIFT, UPDATE_GW } from "../minicart/utils.ts";

import { sendEvent } from "site/sdk/analytics.tsx";
import { AddToCartParams } from "apps/commerce/types.ts";
import { setCookie } from "site/utils/cache-client/cookie.ts";

export interface Props {
  sku: string;
  addToCartButton?: string;
  dontUpdateCart?: boolean;
  productId: string;
  eventParams: AddToCartParams;
}

const AddToCart = (
  { sku, productId, addToCartButton, dontUpdateCart, eventParams }: Props,
) => {
  const { cart, addItem } = useCart();
  const { updateQuantity, allowUpdate } = useForceUpdateCart();

  const { addToast } = useToast();
  const { quantity } = useModal();

  const { reloadItems } = state;
  const loading = useSignal(false);

  const onAddItem = async () => {
    dontUpdateCart && (allowUpdate.value = true);

    try {
      addToast({
        type: "success",
        message: "Produto Adicionado à Sacola",
      });

      await addItem({
        sku,
        productId,
        dangerouslyOverrideReturnNull: dontUpdateCart,
        qty: quantity,
      });

      const { status } = cart.value || {};

      if (status && status !== 200) {
        throw new Error();
      }

      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });

      setCookie("process_section", 1);

      dontUpdateCart
        ? updateQuantity()
        : reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW };
    } catch (_e) {
      const { message } = cart.value || {};

      console.error("ERROR", _e);

      addToast({
        type: "error",
        message: message ||
          "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      });
    }
  };

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      loading.value = true;
      await onAddItem();
    } finally {
      loading.value = false;
    }
  };

  return (
    <button
      id="add-to-cart"
      onClick={onClick}
      disabled={loading.value}
      class="h-full w-full md:w-fit flex items-center justify-center md:px-8 2xl:px-16 py-4 border md:rounded bg-green-800 text-white hover:text-green-800 hover:border-green-800 border-transparent hover:bg-white  transition duration-200 uppercase font-matria"
    >
      <Icon
        id="ShoppingCart"
        size={24}
        strokeWidth={2}
        class="mr-2"
      />
      {addToCartButton}
    </button>
  );
};

export default AddToCart;
