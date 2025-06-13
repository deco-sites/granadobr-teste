import { formatPrice } from "site/sdk/format.ts";
import { Props } from "./types.ts";

const FreeShippingBar = ({ target, total, currency, locale }: Props) => {
  const remaining = target - total;
  const percent = (total / target) * 100;

  return (
    <div class="px-4 w-full mb-3 font-matria">
      <div class="flex flex-col w-full gap-3 bg-purple-100 rounded p-4">
        <div class="flex justify-center items-center text-gray-950">
          {remaining > 0
            ? (
              <span class="text-sm font-normal leading-[18px]">
                Faltam apenas {formatPrice(remaining, currency, locale)}{" "}
                para ganhar <strong class="font-semibold">frete grátis</strong>!
              </span>
            )
            : (
              <span class="text-sm font-normal leading-[18px]">
                Você ganhou <strong class="font-semibold">frete grátis</strong>
                {" "}
                na compra atual!
              </span>
            )}
        </div>

        <progress
          class="progress bg-gray-200 [&::-webkit-progress-value]:bg-green-800 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 rounded h-[6px] w-full"
          value={percent}
          max={100}
        />
      </div>
    </div>
  );
};

export default FreeShippingBar;