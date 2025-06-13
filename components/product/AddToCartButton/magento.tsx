import { useCart } from "site/sdk/hooks/useCart.ts";

import { useToast } from "../../../sdk/useToast.ts";
import { useForceUpdateCart } from "../../../sdk/useForceUpdateCart.ts";

import Button, { Props as BtnProps } from "./common.tsx";

import { UPDATE_GIFT, UPDATE_GW } from "../../minicart/utils.ts";
import { state } from "../../../sdk/hooks/context.ts";
import { setCookie } from "site/utils/cache-client/cookie.ts";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  sku: string;
  productId: string;
  dontUpdateCart?: boolean;
}

function AddToCartButton(
  { sku, productId, eventParams, dontUpdateCart = false }: Props,
) {
  const { addToast } = useToast();
  const { updateQuantity, allowUpdate } = useForceUpdateCart();

  const { reloadItems } = state;
  const { addItem, cart } = useCart();

  const onAddItem = async () => {
    dontUpdateCart && (allowUpdate.value = true);

    try {
      addToast({
        type: "success",
        message: "Produto Adicionado à Sacola",
      });

      console.time("addItem");
      await addItem({
        sku,
        productId,
        dangerouslyOverrideReturnNull: dontUpdateCart,
        qty: 1,
      });
      console.timeEnd("addItem");

      const { status } = cart.value || {};

      if (status && status !== 200) {
        throw new Error();
      }

      setCookie("process_section", 1);

      dontUpdateCart
        ? updateQuantity()
        : reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW };
    } catch (_e) {
      const { message } = cart.value || {};

      addToast({
        type: "error",
        message: message ||
          "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      });
    }
  };

  return <Button onAddItem={onAddItem} eventParams={eventParams} />;
}

export default AddToCartButton;
