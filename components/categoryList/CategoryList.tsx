import SliderJS from "../../islands/SliderJS.tsx";
import Slider from "../../components/ui/Slider.tsx";

import Card from "./components/Card/index.tsx";
import Icon from "../../components/ui/Icon.tsx";

import Show from "../../directives/Show/index.tsx";
import Hide from "../../directives/Hide/index.tsx";

import { useId } from "../../sdk/useId.ts";
import { Props } from "./types.ts";

const CategoryList = (
  { categories, layout, description, title, gtmListId }: Props,
) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  const id = useId();

  return (
    <div
      class="w-full max-w-screen-4xl 4xl:mx-auto"
      data-gtm-list-id={gtmListId}
    >
      <div
        id={id}
        class="flex flex-col pt-4 pb-8 md:pb-5"
      >
        <Show when={!!title || !!description}>
          <div class="flex flex-col gap-4 mb-8 mx-4 md:mx-6 lg:mx-12 2xl:mx-16">
            <Show when={!!title}>
              <div class="font-granado text-5xl text-green-800 text-center">
                {title}
              </div>
            </Show>

            <Show when={!!description}>
              <span class="font-matria text-lg leading-6 text-gray-950 text-center">
                {description}
              </span>
            </Show>
          </div>
        </Show>

        <div class="font-matria flex flex-col ml-4 md:ml-6 lg:ml-12 2xl:mx-16">
          <div class="grid relative">
            <Slider class="carousel gap-4 row-start-2 row-end-5 lg:gap-6">
              {categories?.map((category, index) => (
                <Slider.Item
                  index={index}
                  class="carousel-item rounded items-baseline w-[calc(72.5%_-_8px)] md:w-[calc(22.5%_-_12px)] lg:w-[calc(22.5%_-_18px)] max-h-[300px] sm:max-h-[375px] last-of-type:mr-4 last-of-type:md:mr-6 last-of-type:lg:mr-12 last-of-type:2xl:mr-0"
                >
                  <Show when={!!category.href}>
                    <a
                      href={category.href}
                      class="flex flex-col gap-4 w-full h-full"
                      aria-label={category.label}
                    >
                      <Card {...category} />
                    </a>
                  </Show>

                  <Hide when={!!category.href}>
                    <div class="flex flex-col gap-4 w-full h-full">
                      <Card {...category} />
                    </div>
                  </Hide>
                </Slider.Item>
              ))}
            </Slider>

            <Show when={!!layout?.showArrows}>
              <div class="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10">
                <Slider.PrevButton class="bg-slate-50 border border-gray-200 hover:border-gray-600 w-9 md:w-12 h-9 md:h-12 flex justify-center items-center rounded disabled:opacity-0 shadow-[0_0_26px_rgba(0,0,0,.095)] transition-all">
                  <Icon
                    size={16}
                    id="ChevronLeft"
                    strokeWidth={3}
                  />
                </Slider.PrevButton>
              </div>

              <div class="absolute right-0 md:right-6 top-1/2 -translate-y-1/2 z-10">
                <Slider.NextButton class="bg-slate-50 border border-gray-200 hover:border-gray-600 w-9 md:w-12 h-9 md:h-12 flex justify-center items-center rounded disabled:opacity-0 shadow-[0_0_26px_rgba(0,0,0,.095)] transition-all">
                  <Icon
                    size={16}
                    id="ChevronRight"
                    strokeWidth={3}
                  />
                </Slider.NextButton>
              </div>
            </Show>
          </div>

          <Show when={!!layout?.showDots}>
            <ul
              class={`flex justify-center mt-7 mb-3 col-start-2 row-start-5 gap-x-4 md:gap-x-6 gap-y-6 flex-wrap ${
                categories.length > 1 ? "" : "hidden"
              } ${categories.length > 2 ? "" : "md:hidden"}`}
            >
              {categories.map((_, index) => (
                <li
                  key={index}
                  class="carousel-item hidden leading-[0] [&:nth-child(1n+1)]:block md:[&:nth-child(1n+1)]:hidden md:[&:nth-child(4n+1)]:!block"
                >
                  <Slider.Dot index={index}>
                    <div class="w-4 md:w-[54px] h-[5px] rounded bg-gray-300 group-disabled:bg-green-800" />
                  </Slider.Dot>
                </li>
              ))}
            </ul>
          </Show>
        </div>

        <SliderJS rootId={id} />
      </div>
    </div>
  );
};

export default CategoryList;
