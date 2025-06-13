import { ComponentChildren } from "preact";

export interface Props {
  freeShippingTarget?: number;
  cartType?: "CartSaver" | "Cart";
  children?: ComponentChildren;
}
