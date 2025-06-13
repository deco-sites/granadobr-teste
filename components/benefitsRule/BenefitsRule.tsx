import SliderJS from "../../islands/SliderJS.tsx";
import Slider from "../../components/ui/Slider.tsx";

import Icon from "../../components/ui/Icon.tsx";
import Show from "../../directives/Show/index.tsx";

import Card from "./components/Card/index.tsx";
import { useId } from "../../sdk/useId.ts";

import { Props } from "./types.ts";

const BenefitsRule = ({
  layout,
  benefits,
}: Props) => {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  const id = useId();

  return (
    <div
      id={id}
      class="relative flex justify-between mt-10 px-4 md:px-6 font-matria 2xl:container"
    >
      <Show when={!!layout?.showArrows}>
        <div class="md:hidden absolute top-1/2 transform -translate-y-1/2 left-0">
          <Slider.PrevButton class="w-12 h-12 flex justify-center items-center text-gray-900 disabled:opacity-0 transition-all">
            <Icon
              size={24}
              id="ChevronLeft"
              strokeWidth={3}
              class="w-5"
            />
          </Slider.PrevButton>
        </div>
      </Show>

      <Slider class="carousel carousel-center sm:carousel-end row-start-2 row-end-5 items-center md:items-start w-full">
        {benefits.map((item, index) => (
          <Slider.Item
            index={index}
            class="carousel-item justify-center w-full md:w-[calc(20%_-_12px)] px-1.5"
          >
            <Card {...item} />
          </Slider.Item>
        ))}
      </Slider>

      <Show when={!!layout?.showArrows}>
        <div class="md:hidden absolute top-1/2 transform -translate-y-1/2 right-0">
          <Slider.NextButton class="w-12 h-12 flex justify-center items-center text-gray-900 disabled:opacity-0 transition-all">
            <Icon
              size={24}
              id="ChevronRight"
              strokeWidth={3}
              class="w-5"
            />
          </Slider.NextButton>
        </div>
      </Show>

      <SliderJS rootId={id} interval={(layout?.interval ?? 0) * 1000} />
    </div>
  );
};

export default BenefitsRule;
