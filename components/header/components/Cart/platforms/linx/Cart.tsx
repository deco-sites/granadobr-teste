import { itemToAnalyticsItem, useCart } from "apps/linx/hooks/useCart.ts";
import CartButton from "../../../CartButton/index.tsx";

const Cart = () => {
  const { loading, cart } = useCart();

  const products = cart.value?.Basket?.Items;
  const coupon = cart.value?.Basket?.Coupons?.[0]?.Code;
  const cartSize = cart.value?.Basket?.Items?.length || 0;

  return (
    <CartButton
      currency="BRL"
      loading={loading.value}
      total={cartSize}
      items={(products ?? []).map((item, index) =>
        itemToAnalyticsItem(item, coupon, index)
      )}
    />
  );
};

export default Cart;
