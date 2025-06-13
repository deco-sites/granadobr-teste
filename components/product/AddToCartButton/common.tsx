import { useSignal } from "@preact/signals";

import Icon from "../../../components/ui/Icon.tsx";
import Button from "../../../components/ui/Button.tsx";

import { sendEvent } from "../../../sdk/analytics.tsx";
import { AddToCartParams } from "apps/commerce/types.ts";

import { useId } from "../../../sdk/useId.ts";
import { state } from "../../../sdk/hooks/context.ts";

export interface Props {
  eventParams: AddToCartParams;
  onAddItem: () => Promise<void>;
}

const useAddToCart = ({ eventParams, onAddItem }: Props) => {
  const loading = useSignal(false);
  const { disableAddButton } = state;

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      loading.value = true;
      disableAddButton.value = true;
      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });
      await onAddItem();
    } finally {
      loading.value = false;
      disableAddButton.value = false;
    }
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
      // it is forced to improve user experience
      // but it could be a problem if the user clicks the button multiple times
      // and the request is not finished yet
      loading={false}
      disabled={false}
      id={id}
      class="self-center gap-1.5 font-matria font-normal text-lg border-green-800 hover:border-green-800 text-green-800 hover:text-white bg-white hover:bg-green-800 disabled:border-[#30303033] rounded w-full flex-nowrap"
      classLoading="disabled:text-gray-600 disabled:bg-gray-200 disabled:border-0"
      ariaLabel="Adicionar à sacola"
    >
      <Icon
        size={20}
        id="ShoppingCart"
        class="md:hidden lg:block"
        strokeWidth={2}
      />
      Adicionar
    </Button>
  );
}
