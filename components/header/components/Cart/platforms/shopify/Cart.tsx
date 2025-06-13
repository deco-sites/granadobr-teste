import { itemToAnalyticsItem, useCart } from "apps/shopify/hooks/useCart.ts";
import CartButton from "../../../CartButton/index.tsx";

const Cart = () => {
  const { cart, loading } = useCart();

  const items = cart.value?.lines?.nodes ?? [];
  const total = cart.value?.cost?.totalAmount.amount ?? 0;
  const currency = cart.value?.cost?.totalAmount.currencyCode ?? "BRL";

  return (
    <CartButton
      currency={currency}
      total={Number(total)}
      loading={loading.value}
      items={items.map((item, index) => itemToAnalyticsItem(item, index))}
    />
  );
};

export default Cart;
