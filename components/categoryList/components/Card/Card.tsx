import Image from "apps/website/components/Image.tsx";
import Icon from "../../../ui/Icon.tsx";

import { Props } from "./types.ts";

const Card = (
  {
    label,
    description,
    image,
    alt,
  }: Props,
) => {
  return (
    <div class="relative group w-full h-full">
      <div
        class="skeleton bg-gray-200 w-full rounded max-h-[300px] sm:max-h-[375px]"
        style="aspect-ratio: 160 / 195"
      />

      <figure class="absolute inset-0 overflow-hidden rounded-md h-full">
        <Image
          width={160}
          loading="lazy"
          fetchPriority="low"
          class="rounded w-full h-full object-cover transition-transform duration-300 transform origin-center lg:group-hover:scale-105"
          alt={alt || label}
          height={195}
          src={image}
        />
      </figure>

      <div class="absolute inset-0 rounded-md z-10 bg-gradient-to-t from-black to-transparent h-full w-full opacity-50" />

      <div class="absolute left-6 right-6 bottom-6 z-10 grid overflow-hidden grid-rows-[auto_0fr] duration-500 lg:group-hover:grid-rows-[auto_1fr] transition-[grid-template-rows]">
        <h3 class="text-[32px] md:text-[30px] lg:text-[32px] leading-none uppercase text-white font-granado font-medium m-0 break-all">
          {label}
        </h3>

        <div class="invisible col-start-1 row-start-2 min-h-0 transition-[visibility] duration-500 lg:group-hover:visible">
          <p class="mt-2 font-matria font-normal leading-6 text-white">
            {description}
          </p>

          <div class="flex items-center gap-1.5 mt-2 text-white">
            <span class="text-lg leading-[22px] hover:underline">
              Conheça
            </span>

            <Icon id="ArrowRight" size={16} />
          </div>
        </div>

        <div class="flex items-center gap-1.5 mt-2 text-white lg:hidden">
          <span class="text-lg leading-[22px]">
            Conheça
          </span>

          <Icon id="ArrowRight" size={16} />
        </div>
      </div>
    </div>
  );
};

export default Card;
