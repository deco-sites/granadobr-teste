import { useCart as useCartApps } from "site/magento/hooks/useCart.ts";
import { state } from "./context.ts";

const data = useCartApps();

export const useCart = () => ({
  cart: state.cart,
  ...data,
});

// if (items?.length > 0) {
//   setCookie("has_products", 1);
//   const isBox = items.some((i) => i?.extension_attributes?.is_box);
//   if (isBox) {
//     setCookie("is_box", 1);
//   } else {
//     setCookie("is_box", 0);
//   }
// } else {
//   setCookie("has_products", 0);
//   setCookie("is_box", 0);
// }
