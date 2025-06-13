import { JSX } from "preact";

import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import Icon from "../../../../components/ui/Icon.tsx";
import Button from "../../../../components/ui/Button.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { useToast } from "../../../../sdk/useToast.ts";
import { Props } from "./types.ts";

const Coupon = ({
  title,
  coupon,
  onManageCoupon,
  placeholder,
  type,
}: Props) => {
  const { addToast } = useToast();

  const isValid = useSignal(true);
  const isLoading = useSignal(false);

  const currentCoupon = useSignal(coupon);

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentCoupon.value) {
      const {
        currentTarget: { elements },
      } = event;

      const input = elements.namedItem(type) as HTMLInputElement;

      isValid.value = false;
      input.focus();

      return;
    }

    isValid.value = true;
    isLoading.value = true;

    try {
      const result = await onManageCoupon({
        couponCode: currentCoupon.value,
      });

      const defaultMessage = coupon?.length
        ? "Seu cupom foi removido com sucesso."
        : "Seu cupom foi aplicado com sucesso.";

      addToast({
        message: result?.message || defaultMessage,
        type: result?.status || "success",
      });
    } catch (_e) {
      addToast({
        message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    currentCoupon.value = coupon;
  }, [coupon]);

  return (
    <div class="collapse bg-purple-100 mt-6 rounded">
      <input type="checkbox" id={`${type}-collapse`} class="peer min-h-[0]" />

      <label
        htmlFor={`${type}-collapse`}
        class="collapse-title min-h-[0] p-4 text-sm leading-4"
      >
        <span class="block text-gray-950">{title}</span>
      </label>

      <div class="absolute right-4 top-[18px] text-gray-950 transition-transform ease-in duration-300 peer-checked:rotate-180">
        <Icon size={12} id="ChevronDown" />
      </div>

      <div class="collapse-content">
        <form
          class="flex gap-2 mt-1"
          onSubmit={onSubmit}
          id={`cart-${type}`}
        >
          <div class="flex flex-col gap-2 grow">
            <input
              id={type}
              name={type}
              disabled={isLoading.value || !!coupon}
              onChange={(
                e: JSX.TargetedEvent<HTMLInputElement>,
              ) => (currentCoupon.value = e.currentTarget.value)}
              class="text-sm leading-4 outline-none rounded bg-white disabled:bg-gray-200 border border-solid border-gray-200 text-gray-950 disabled:text-gray-600 placeholder:text-gray-950 disabled:placeholder:text-gray-600 px-2 h-10"
              value={currentCoupon.value ?? ""}
              placeholder={placeholder}
              type="text"
            />

            <Hide when={isValid.value}>
              <span class="text-xs leading-[15px] text-red-600">
                Este é um campo obrigatório
              </span>
            </Hide>
          </div>

          <Button
            type="submit"
            title={coupon ? "Cancelar" : "Aplicar"}
            class="text-sm font-normal leading-4 rounded px-5 border-green-800 disabled:border-gray-200 hover:border-green-800 text-green-800 disabled:text-gray-600 hover:text-white bg-white disabled:bg-gray-200 hover:bg-green-800 min-h-10 h-10 transition-colors ease-in duration-200"
            aria-label={coupon ? "Cancelar cupom" : "Aplicar cupom"}
            disabled={isLoading.value}
            htmlFor={type}
          >
            <Show when={isLoading.value}>
              <span class="loading loading-spinner absolute w-[22px]" />
            </Show>

            <span {...(isLoading.value && { class: "opacity-0 invisible" })}>
              {coupon ? "Cancelar" : "Aplicar"}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Coupon;
