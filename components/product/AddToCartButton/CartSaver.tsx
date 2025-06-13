import { signal } from "@preact/signals";
import { AddToCartParams } from "apps/commerce/types.ts";
import Button from "../../../components/ui/Button.tsx";
import Icon from "../../../components/ui/Icon.tsx";
import { sendEvent } from "../../../sdk/analytics.tsx";
import { state } from "../../../sdk/hooks/context.ts";
import { useId } from "../../../sdk/useId.ts";
import { useToast } from "site/sdk/useToast.ts";

export interface Props {
  eventParams: AddToCartParams;
}

export interface CartSaverItem {
  productId: string;
  qty: number;
  price: number;
  name: string;
}

export const LOCAL_STORAGE_CART_SAVER = "CartSaver";

const cartItems = signal<CartSaverItem[]>([]);
const localCart = globalThis.localStorage.getItem("CartSaver");
if (localCart) {
  cartItems.value = JSON.parse(localCart);
}

export const useCartSaver = () => {
  const add = (current: CartSaverItem) => {
    const existingItemIndex = cartItems.value.findIndex((item) =>
      item.productId === current.productId
    );
    const item = cartItems.peek()[existingItemIndex];
    if (existingItemIndex !== -1) {
      update({
        ...item,
        qty: item.qty + 1,
      });
    } else {
      cartItems.value = cartItems.value.concat([current]);
    }

    globalThis.localStorage.setItem(
      LOCAL_STORAGE_CART_SAVER,
      JSON.stringify(cartItems.value),
    );
  };

  const remove = (item: CartSaverItem) => {
    const newCartItems = cartItems.peek().filter((current) =>
      current.productId !== item.productId
    );
    cartItems.value = newCartItems;

    globalThis.localStorage.setItem(
      LOCAL_STORAGE_CART_SAVER,
      JSON.stringify(newCartItems),
    );
  };

  const update = (item: CartSaverItem) => {
    const newCartItems = cartItems.peek().map((current) => {
      if (current.productId === item.productId) {
        return {
          ...current,
          ...item,
        };
      }
      return current;
    });
    cartItems.value = newCartItems;

    globalThis.localStorage.setItem(
      LOCAL_STORAGE_CART_SAVER,
      JSON.stringify(newCartItems),
    );
  };

  return {
    add,
    remove,
    update,
    cartItems,
  };
};

const loading = signal(false);
const useAddToCart = ({ eventParams }: Props) => {
  const { disableAddButton } = state;
  const { addToast } = useToast();
  const { add } = useCartSaver();

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    loading.value = true;
    disableAddButton.value = true;

    add({
      productId: (eventParams.items[0] as any).item_id,
      qty: eventParams.items[0].quantity,
      price: eventParams.items[0].price!,
      name: (eventParams.items[0] as any).item_name,
    });

    sendEvent({
      name: "add_to_cart",
      params: eventParams,
    });

    addToast({
      type: "success",
      message: "Produto Adicionado à Sacola",
    });

    disableAddButton.value = false;
    loading.value = false;
  };

  return {
    onClick,
    loading: loading.value,
    "data-deco": "add-to-cart",
    disabled: disableAddButton.value,
  };
};

export default function AddToCartButton(props: Props) {
  const btnProps = useAddToCart(props);
  const id = useId();

  return (
    <Button
      {...btnProps}
      id={id}
      class="self-center content-center font-matria w-5/6 md:w-4/5 border border-green-800 text-green-800 bg-white hover:bg-green-800 hover:text-white md:text-lg text-lg font-[350] flex-col md:flex-row px-2 mb-1 md:mb-4"
    >
      <Icon id="ShoppingCart" size={20} strokeWidth={2} />
      Adicionar
    </Button>
  );
}
