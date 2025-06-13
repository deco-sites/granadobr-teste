import SliderJS from "../../islands/SliderJS.tsx";
import Slider from "../../components/ui/Slider.tsx";

import Item from "./components/Item/index.tsx";
import Icon from "../../components/ui/Icon.tsx";

import Show from "../../directives/Show/index.tsx";
import Hide from "../../directives/Hide/index.tsx";

import { useId } from "../../sdk/useId.ts";
import { Props } from "./types.ts";

const SmallBanner = ({
  banners,
  interval,
  preload,
  layout,
}: Props) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  const id = useId();

  return (
    <div
      id={id}
      class="relative leading-[0] mt-8 md:mt-10"
    >
      <Show when={!!layout?.showArrows}>
        <div class="absolute top-1/2 transform -translate-y-1/2 left-0 z-10">
          <Slider.PrevButton class="w-9 h-9 flex justify-center items-center text-gray-900 md:mr-1 disabled:opacity-0 transition-all">
            <Icon
              size={24}
              id="ChevronLeft"
              strokeWidth={3}
              class="w-5"
            />
          </Slider.PrevButton>
        </div>

        <div class="absolute top-1/2 transform -translate-y-1/2 right-0 z-10">
          <Slider.NextButton class="w-9 h-9 flex justify-center items-center text-gray-900 md:mr-1 disabled:opacity-0 transition-all">
            <Icon
              size={24}
              id="ChevronRight"
              strokeWidth={3}
              class="w-5"
            />
          </Slider.NextButton>
        </div>
      </Show>

      <Slider class="carousel carousel-center col-span-full row-span-full w-full">
        {banners.map((banner, index) => (
          <Slider.Item
            index={index}
            class="carousel-item w-full relative"
          >
            <Show when={!!banner.href}>
              <a
                class="block w-full"
                href={banner.href}
                {...(banner.openInNewTab && {
                  rel: "noopener noreferrer",
                  target: "_blank",
                })}
                aria-label={banner.alt}
              >
                <Item {...banner} preload={preload} index={index} />
              </a>
            </Show>

            <Hide when={!!banner.href}>
              <Item {...banner} preload={preload} index={index} />
            </Hide>
          </Slider.Item>
        ))}
      </Slider>

      <Show when={!!layout?.showDots}>
        <ul class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-4 md:gap-6">
          {banners.map((_, index) => (
            <li key={index} class="leading-[0px]">
              <Slider.Dot index={index}>
                <div
                  aria-label={`Ir ao slider ${index}`}
                  class="w-[34px] md:w-[54px] h-1 md:h-[5px] rounded-full bg-gray-200 group-disabled:bg-gray-600 group-disabled:cursor-not-allowed"
                />
              </Slider.Dot>
            </li>
          ))}
        </ul>
      </Show>

      <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
};

export default SmallBanner;
