import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { useSignal } from "@preact/signals";
import Button from "../../../../components/ui/Button.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { getCookie, setCookie } from "../../../../utils/cache-client/cookie.ts";

import { formatPrice, formatZipCode } from "../../../../sdk/format.ts";
import { Props, ShippingRate } from "./types.ts";

const EstimateShipping = ({
  placeholder,
  onEstimateShipping,
  onSetShipping,
}: Props) => {
  const isLoading = useSignal(false);

  const zipCode = useSignal("");
  const shippingRates = useSignal<ShippingRate[]>([]);

  const isValid = useSignal(true);
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();

    globalThis.window.dataLayer.push({
      event: "button_click",
      click_category: "mini-cart",
      click_text: "calcular-cep",
      click_description: "Clique no botão 'Calcular' no mini cart",
    });

    if (!inputEl.current?.value || inputEl.current?.value.length !== 9) {
      isValid.value = false;
      inputEl.current?.focus();

      return;
    }

    const shippingAddressFromData = {
      country_id: "BR",
      postcode: inputEl.current.value,
    };

    setCookie(
      "shipping_address_from_data",
      JSON.stringify(shippingAddressFromData),
    );

    isLoading.value = true;
    isValid.value = true;

    try {
      shippingRates.value = await onEstimateShipping({
        countryId: "BR",
        postcode: inputEl.current.value,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const onChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const formattedValue = formatZipCode(value);

    inputEl.current!.value = formattedValue;
    zipCode.value = formattedValue;
  };

  const onMethodChange = async (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    try {
      const [carrierCode, methodCode] = value.split("_");
      const postcode = inputEl.current?.value;

      if (postcode) {
        await onSetShipping({ carrierCode, postcode, methodCode });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const shippingAddressFromData = getCookie("shipping_address_from_data");

    if (shippingAddressFromData) {
      const { postcode } = JSON.parse(shippingAddressFromData);
      zipCode.value = postcode || "";
    }
  }, []);

  return (
    <div class="flex flex-col mt-6">
      <form class="flex join" onSubmit={onSubmit}>
        <div class="flex flex-col gap-2 grow">
          <input
            id="zipCode"
            ref={inputEl}
            onChange={onChange}
            disabled={isLoading.value}
            class="text-sm leading-4 outline-none rounded bg-white border border-solid border-gray-200 text-gray-950 placeholder:text-gray-950 focus:border-e-green-800 px-2 h-[42px] join-item"
            value={inputEl.current?.value
              ? inputEl.current?.value
              : formatZipCode(zipCode.value)}
            placeholder={placeholder || "Informe seu CEP"}
            name="zipCode"
            maxLength={9}
            type="text"
          />

          <Hide when={isValid.value}>
            <span class="text-xs leading-none text-red-600">
              Por favor, informe um CEP com 8 digitos
            </span>
          </Hide>
        </div>

        <Button
          type="submit"
          title="Calcular"
          disabled={isLoading.value}
          class="text-sm font-normal leading-4 rounded px-2 border-green-800 disabled:border-gray-200 hover:border-green-800 text-white disabled:text-gray-600 hover:text-green-800 bg-green-800 disabled:bg-gray-200 hover:bg-white min-h-10 h-[42px] transition-colors ease-in duration-200 join-item relative"
          aria-label="Calcular frete"
          htmlFor="postcode"
        >
          <Show when={isLoading.value}>
            <span class="loading loading-spinner absolute w-[22px]" />
          </Show>

          <span {...(isLoading.value && { class: "opacity-0 invisible" })}>
            Calcular
          </span>
        </Button>
      </form>

      <div class="relative">
        <Show when={isLoading.value && shippingRates.value.length > 0}>
          <div class="absolute inset-0 bg-white/50 z-10" />
        </Show>

        {shippingRates.value.length > 0 && (
          <ul class="flex flex-col gap-4 mt-5">
            {shippingRates.value.map((rate: ShippingRate) => (
              <li
                class="flex items-center gap-2 pb-4 border-b border-gray-200 relative"
                key={`${rate.carrier_code}_${rate.method_code}`}
              >
                <input
                  type="radio"
                  onChange={onMethodChange}
                  id={`s_method_${rate.carrier_code}_${rate.method_code}`}
                  value={`${rate.carrier_code}_${rate.method_code}`}
                  class="peer absolute w-4 h-4 opacity-0"
                  name="s_method"
                />

                <span class="flex items-center rounded-full before:content-[''] before:flex before:shrink-0 before:bg-white before:w-4 before:h-4 before:rounded-full before:shadow-[inset_0_0_0_1px_#BDBDBD] peer-checked:before:shadow-[inset_0_0_0_5px_#025A44]" />

                <label
                  class="flex items-center justify-between text-gray-950 text-sm leading-4 grow"
                  for={`s_method_${rate.carrier_code}_${rate.method_code}`}
                >
                  <span>{rate.method_title || rate.carrier_title}</span>
                  <span class="font-semibold mr-4">
                    {formatPrice(rate.amount) || "Grátis"}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EstimateShipping;
