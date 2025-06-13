import { JSX } from "preact";
import { useEffect } from "preact/hooks";

import { useSignal } from "@preact/signals";
import Icon from "../../../../components/ui/Icon.tsx";
import { sendEvent } from "../../../../sdk/analytics.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { Props } from "./types.ts";

const GiftWrapping = ({
  index,
  giftWrapping: { options, settings },
  onManageGiftWrapping,
}: Props) => {
  const isLoading = useSignal(false);
  const selectedOption = useSignal<number | null>(settings.gw_id);

  const onChange = async (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const { value, dataset } = event.currentTarget;
    const castValue = parseInt(value);

    isLoading.value = true;

    selectedOption.value = selectedOption.value === castValue
      ? null
      : castValue;

    sendEvent({
      name: "button_click",
      params: {
        click_category: "minicart",
        click_text: "clique-embalagem",
        click_description: dataset.label,
      },
    });

    try {
      await onManageGiftWrapping({
        index,
        gwId: castValue,
        action: selectedOption.value === null ? "remove" : "add",
      });
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    selectedOption.value = settings.gw_id;
  }, [settings]);

  return (
    <div class="relative font-matria">
      <div class="collapse rounded-none">
        <input
          type="checkbox"
          id={`gw_collapse_${index}`}
          class="peer min-h-[0]"
        />

        <label
          htmlFor={`gw_collapse_${index}`}
          class="collapse-title min-h-[0] !p-0 text-sm leading-5"
        >
          <span class="font-normal ml-6 text-gray-950">
            Selecione a embalagem
          </span>
        </label>

        <div class="absolute top-1 left-0 transition-transform ease-in duration-300 peer-checked:rotate-180">
          <Icon size={12} id="ChevronDown" />
        </div>

        <div class="collapse-content !p-0">
          <div class="relative mt-3">
            <Show when={isLoading.value}>
              <div class="absolute inset-0 bg-purple-100/50 z-10" />
            </Show>

            <ul class="grid grid-cols-2 gap-x-2 gap-y-4">
              {options?.map(({ id, label }) => (
                <li class="flex items-center gap-2 relative" key={id}>
                  <input
                    type="checkbox"
                    name="wrapping-options"
                    id={`gw_item_${index}_${id}`}
                    class="peer absolute w-4 h-4 opacity-0"
                    checked={id === selectedOption.value}
                    onClick={onChange}
                    value={id}
                    data-label={label}
                  />

                  <span class="flex items-center rounded-full before:content-[''] before:flex before:shrink-0 before:bg-white before:w-4 before:h-4 before:rounded-full before:shadow-[inset_0_0_0_1px_#BDBDBD] peer-checked:before:shadow-[inset_0_0_0_5px_#025A44]" />

                  <label
                    class="flex items-center justify-between text-gray-950 text-sm leading-4 grow"
                    for={`gw_item_${index}_${id}`}
                  >
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Show when={isLoading.value}>
        <div class="absolute top-0 left-[168px] z-10">
          <span class="loading loading-spinner h-5 w-5 bg-green-600" />
        </div>
      </Show>

      <Hide when={isLoading.value}>
        <div
          class="tooltip tooltip-top absolute top-0 left-[168px] z-10 before:bg-[#666] before:text-white before:max-w-[180px] before:p-[6px] before:text-[13px] before:mb-1 after:mb-1 after:border-t-[#666]"
          data-tip="Sacola: sacola de papel kraft. Kit: sacola kraft, laço de fita verde, papel seda e adesivo."
        >
          <div class="text-gray-950 md:text-gray-600 hover:text-gray-950 cursor-pointer">
            <Icon size={20} id="DoubtCircle" />
          </div>
        </div>
      </Hide>
    </div>
  );
};

export default GiftWrapping;
