import { useId } from "preact/hooks";
import { useSignal } from "@preact/signals";

import Button from "../../../ui/Button.tsx";
import Image from "apps/website/components/Image.tsx";

import SliderJS from "../../../../islands/SliderJS.tsx";
import Slider from "../../../../components/ui/Slider.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { Props } from "./types.ts";

const Gifts = ({ items, onAddItem }: Props) => {
  const id = `${useId()}-gifts`;
  const isLoading = useSignal(false);

  const onAddGift = async (itemId: number) => {
    isLoading.value = true;

    try {
      await onAddItem({
        itemId,
        isPromoItems: true,
      });
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="flex flex-col mt-6 pl-4" id={id}>
      <div class="flex gap-2 item-center">
        <h3 class="text-base font-normal leading-5">Selecione seu brinde</h3>

        <Show when={isLoading.value}>
          <span class="loading loading-spinner h-5 w-5 bg-green-600" />
        </Show>
      </div>

      <Slider class="carousel carousel-center gap-1.5 mt-4 lg:max-w-[570px]">
        {items?.map((item, index) => (
          <Slider.Item
            key={index}
            index={index}
            class="carousel-item flex-col gap-2 p-3 max-w-[86px] border border-gray-200 rounded last:mr-4"
          >
            <Show when={!!item.url}>
              <a
                href={item.url}
                aria-label={item.name}
                class="flex flex-col items-center gap-2"
              >
                <div class="w-full max-w-[54px]">
                  <Image
                    height={70}
                    {...item.image}
                    class="h-fit rounded"
                    alt={item.name}
                    width={54}
                    fetchPriority="low"
                    loading="lazy"
                  />
                </div>

                <span class="text-sm px-2 leading-[18px] line-clamp-3 text-gray-950">
                  {item.name}
                </span>
              </a>
            </Show>

            <Hide when={!!item.url}>
              <div class="flex flex-col items-center gap-2">
                <div class="w-full max-w-[54px]">
                  <Image
                    height={70}
                    {...item.image}
                    class="h-fit rounded"
                    alt={item.name}
                    width={54}
                    fetchPriority="low"
                    loading="lazy"
                  />
                </div>

                <span class="text-sm px-2 leading-[18px] line-clamp-3 text-gray-950">
                  {item.name}
                </span>
              </div>
            </Hide>

            <Button
              title="Selecionar"
              disabled={isLoading.value}
              onClick={() => onAddGift(item.itemId)}
              class="text-xs font-normal leading-4 rounded mx-[3px] px-5 border-green-800 disabled:border-gray-200 hover:border-green-800 text-green-800 disabled:text-gray-600 hover:text-white bg-white disabled:bg-gray-200 hover:bg-green-800 min-h-6 h-6 transition-colors ease-in duration-200"
              aria-label="Selecionar"
            >
              Selecionar
            </Button>
          </Slider.Item>
        ))}
      </Slider>

      <Show when={items.length > 3}>
        <ul class="flex justify-center gap-4 mt-4">
          {items.map((_, index) => (
            <li
              key={index}
              class="leading-[0px] max-h-1 hidden [&:nth-child(3n+1)]:block"
            >
              <Slider.Dot index={index}>
                <div
                  aria-label={`Ir ao slider ${index}`}
                  class="w-7 h-1 -translate-y-0.5 rounded-full bg-gray-200 group-disabled:bg-green-800 group-disabled:cursor-not-allowed"
                />
              </Slider.Dot>
            </li>
          ))}
        </ul>

        <SliderJS rootId={id} />
      </Show>
    </div>
  );
};

export default Gifts;
