import { useCart } from "site/sdk/hooks/useCart.ts";
import { useEffect } from "preact/hooks";

import { UPDATE_GIFT, UPDATE_GW } from "../../../../../minicart/utils.ts";
import CartButton from "../../../CartButton/index.tsx";

import { state } from "../../../../../../sdk/hooks/context.ts";
import { useForceUpdateCart } from "../../../../../../sdk/useForceUpdateCart.ts";

import { useCartSaver } from "site/components/product/AddToCartButton/CartSaver.tsx";
import { invoke } from "../../../../../../runtime.ts";
import { Props } from "../../types.ts";

const Cart = (
  { dontUpdateCartAfter, cartType }: Props & { cartType: string },
) => {
  const { cartItems } = useCartSaver();
  const { reloadItems } = state;
  const { cart, loading } = useCart();

  const { addItem, onLoad } = dontUpdateCartAfter;
  const { quantity, allowUpdate, updateQuantity, reloadQuantity } =
    useForceUpdateCart();

  const { items, items_qty, currency, totalizers } = cart.value || {
    items: [],
  };

  const total = totalizers?.grand_total || 0;
  const currencyCode = currency?.base_currency_code ?? "BRL";

  const forceUpdateCartHandler = async () => {
    if (!allowUpdate.value || !onLoad) {
      return;
    }

    allowUpdate.value = false;
    loading.value = true;

    try {
      cart.value = await invoke.magento.loaders.cart();
      reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW };

      updateQuantity(cart?.value?.items_qty || 0);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    if (!(addItem || onLoad)) {
      return;
    }

    if (items_qty !== undefined) {
      updateQuantity(items_qty);
    } else {
      loading.value = false;
      reloadQuantity();
    }
  }, [items_qty]);

  return (
    <CartButton
      currency={currencyCode}
      items={items}
      quantity={cartType === "CartSaver"
        ? cartItems.value.reduce((acc, item) => item.qty + acc, 0)
        : addItem || onLoad
        ? quantity.value
        : items_qty}
      forceUpdateCart={forceUpdateCartHandler}
      loading={loading.value}
      total={Number(total)}
    />
  );
};

export default Cart;
