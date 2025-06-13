import Image from "apps/website/components/Image.tsx";

import SliderJS from "../../islands/SliderJS.tsx";
import Slider from "../../components/ui/Slider.tsx";

import Icon from "../../components/ui/Icon.tsx";
import Show from "../../directives/Show/index.tsx";

import { useId } from "../../sdk/useId.ts";
import { preventXSS } from "../../sdk/format.ts";

import { Props } from "./types.ts";

const About = ({
  alt,
  image,
  label,
  items,
  layout: { showArrows = true, showDots = true },
}: Props) => {
  const id = useId();

  return (
    <div class="text-white bg-green-800 w-full font-matria">
      <div class="flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-6 py-10 lg:py-16 lg:px-8 xl:container">
        <div class="flex flex-col items-center justify-center gap-6 w-full lg:w-auto">
          <h2 class="font-granado text-[32px] lg:text-5xl font-medium leading-9 lg:leading-[52px]">
            {label}
          </h2>

          <div
            id={id}
            class="flex flex-col items-center px-4 md:px-16 lg:px-0 w-full"
          >
            <div class="flex items-center justify-between gap-2 md:gap-4 lg:gap-6 w-full">
              <Show when={items.length > 1 && !!showArrows}>
                <Slider.PrevButton class="text-gray-950 lg:text-green-200 lg:hover:text-white bg-white lg:bg-transparent disabled:opacity-0 rounded-[5px] lg:rounded-none p-[6px] lg:p-0 shadow-[0_3px_28px_0_#00000029] lg:shadow-none transition-colors ease-in duration-100 rotate-180">
                  <Icon
                    id="ChevronRight"
                    class="w-[18px] lg:w-7 h-[18px] lg:h-7"
                  />
                </Slider.PrevButton>
              </Show>

              <Slider class="carousel carousel-center gap-8 lg:max-w-[570px]">
                {items.map((item, index) => (
                  <Slider.Item
                    index={index}
                    class="carousel-item items-center w-full"
                  >
                    {item.htmlFormat
                      ? (
                        <span
                          class="text-base lg:text-lg text-left leading-[18px] lg:leading-5"
                          dangerouslySetInnerHTML={{
                            __html: preventXSS(item.label),
                          }}
                        />
                      )
                      : (
                        <span class="text-base lg:text-lg text-left leading-[18px] lg:leading-5">
                          {item.label}
                        </span>
                      )}
                  </Slider.Item>
                ))}
              </Slider>

              <Show when={items.length > 1 && !!showArrows}>
                <Slider.NextButton class="text-gray-950 lg:text-green-200 lg:hover:text-white bg-white lg:bg-transparent disabled:opacity-0 rounded-[5px] lg:rounded-none p-[6px] lg:p-0 shadow-[0_3px_28px_0_#00000029] lg:shadow-none transition-colors ease-in duration-300 rotate-0">
                  <Icon
                    id="ChevronRight"
                    class="w-[18px] lg:w-7 h-[18px] lg:h-7"
                  />
                </Slider.NextButton>
              </Show>
            </div>

            <Show when={items.length > 1 && !!showDots}>
              <ul class="flex justify-center gap-4 md:gap-6 mt-7">
                {items.map((_, index) => (
                  <li key={index} class="leading-[0px]">
                    <Slider.Dot index={index}>
                      <div class="w-[34px] md:w-[54px] h-1 md:h-[5px] rounded-full bg-green-200 group-disabled:bg-white group-disabled:cursor-not-allowed" />
                    </Slider.Dot>
                  </li>
                ))}
              </ul>
            </Show>

            <Show when={items.length > 1}>
              <SliderJS rootId={id} />
            </Show>
          </div>
        </div>

        <div class="relative w-full lg:w-[720px] h-[300px] md:h-[364px]">
          <div class="skeleton bg-gray-200 h-full w-full rounded-none lg:rounded" />

          <Image
            width={720}
            loading="lazy"
            fetchPriority="low"
            class="absolute inset-0 h-full w-full object-cover lg:rounded"
            alt={alt || label}
            height={364}
            src={image}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
