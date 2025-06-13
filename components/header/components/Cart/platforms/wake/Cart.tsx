import { itemToAnalyticsItem, useCart } from "apps/wake/hooks/useCart.ts";
import CartButton from "../../../CartButton/index.tsx";

const Cart = () => {
  const { loading, cart } = useCart();
  const { total, products, coupon } = cart.value;

  return (
    <CartButton
      currency="BRL"
      loading={loading.value}
      total={total}
      items={(products ?? []).map((item, index) =>
        itemToAnalyticsItem({ ...item!, coupon: coupon ?? "" }, index)
      )}
    />
  );
};

export default Cart;
