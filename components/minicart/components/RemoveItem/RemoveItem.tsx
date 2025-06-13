import Image from "apps/website/components/Image.tsx";
import Icon from "../../../../components/ui/Icon.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { formatPrice } from "../../../../sdk/format.ts";
import { Props } from "./types.ts";

const RemoveItem = ({ image, name, sale, currency, locale, isGift }: Props) => {
  return (
    <div class="flex items-start justify-center gap-4 mb-5">
      <div class="relative h-[90px] w-[70px]">
        <div class="skeleton bg-gray-200 h-full w-full rounded" />

        <Show when={!!image?.src.length}>
          <Image
            width={70}
            {...image}
            class="absolute inset-0 h-full w-full rounded"
            loading="lazy"
            fetchPriority="low"
            height={90}
          />
        </Show>

        <Hide when={!!image?.src.length}>
          <div class="absolute inset-0 flex justify-center w-full max-w-[70px] h-[90px] rounded bg-[#F3F4F6] text-[#B9BDC8] border border-gray-200">
            <Icon
              height={28}
              class="mt-4"
              strokeWidth={0}
              id="NotFound"
              width={36}
            />
          </div>
        </Hide>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm leading-[18px] max-w-[220px]">
          {isGift && !name.includes("Brinde") && "Brinde - "}
          {name}
        </span>

        <span class="text-base font-semibold leading-5">
          {formatPrice(sale, currency, locale) || "Grátis"}
        </span>
      </div>
    </div>
  );
};

export default RemoveItem;
