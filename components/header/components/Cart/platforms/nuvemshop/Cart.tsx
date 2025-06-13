import { itemToAnalyticsItem, useCart } from "apps/nuvemshop/hooks/useCart.ts";
import CartButton from "../../../CartButton/index.tsx";

const Cart = () => {
  const { cart, loading } = useCart();

  const total = cart.value?.total ?? 0;
  const items = cart.value?.products ?? [];
  const currency = cart.value?.currency ?? "BRL";

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
