import Show from "site/directives/Show/Show.tsx";
import Slider from "./Slider.tsx";
import Icon from "site/components/ui/Icon.tsx";

export interface Props {
  images: unknown[];
  arrows?: boolean;
  dots?: boolean;
  dotStyle?: string;
  prevButtonStyle?: string;
  nextButtonStyle?: string;
  buttonIconStyle?: string;
}

function SliderCarousel(props: Props) {
  const {
    images,
    arrows,
    dots,
    dotStyle,
    prevButtonStyle = "",
    nextButtonStyle = "",
    buttonIconStyle = "",
  } = props;

  return (
    <>
      <Show when={images.length > 1 && !!arrows}>
        <div className="relative z-10 col-start-1 row-start-3">
          <Slider.PrevButton
            class={`absolute left-0 flex items-center justify-center disabled:opacity-0 
           lg:disabled:opacity-100 lg:disabled:cursor-not-allowed rounded-[5px] 
           lg:rounded-none p-[6px] lg:p-0 transition-colors ease-in duration-100 rotate-180
           ${prevButtonStyle}`}
          >
            <Icon id="ChevronRight" class={`${buttonIconStyle}`} />
          </Slider.PrevButton>
        </div>
      </Show>

      <Show when={images.length > 1 && !!arrows}>
        <div className="relative z-10 col-start-3 row-start-3">
          <Slider.NextButton
            class={`absolute right-0 flex items-center justify-center disabled:opacity-0 
          lg:disabled:opacity-100 lg:disabled:cursor-not-allowed rounded-[5px] 
          lg:rounded-none p-[6px] lg:p-0 transition-colors ease-in duration-300 rotate-0 
          ${nextButtonStyle}`}
          >
            <Icon id="ChevronRight" class={`${buttonIconStyle}`} />
          </Slider.NextButton>
        </div>
      </Show>

      <Show when={images.length > 1 && !!dots}>
        <ul class="carousel items-center justify-center col-span-full gap-4 md:gap-6 z-10 row-start-4">
          {images.map((_, index) => (
            <li key={index} class="leading-[0px]">
              <Slider.Dot index={index}>
                <div
                  aria-label={`Ir ao slider ${index}`}
                  class={`w-[32px] md:w-[54px] h-1 md:h-[5px] rounded-full ${dotStyle}`}
                />
              </Slider.Dot>
            </li>
          ))}
        </ul>
      </Show>
    </>
  );
}

export default SliderCarousel;
