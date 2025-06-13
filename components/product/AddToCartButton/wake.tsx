import { useCart } from "apps/wake/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  productID: string;
}

function AddToCartButton({ productID, eventParams }: Props) {
  const { addItem } = useCart();
  const onAddItemWake = () =>
    addItem({
      productVariantId: Number(productID),
      quantity: 1,
    });

  return <Button onAddItem={onAddItemWake} eventParams={eventParams} />;
}

export default AddToCartButton;
