import { useId } from "../../../../sdk/useId.ts";
import { AlertProps } from "site/components/header/Header.tsx";
import AlertItem from "./AlertItem.tsx";
import Slider from "../../../../components/ui/Slider.tsx";
import SliderJS from "../../../../components/ui/SliderJS.tsx";
import Icon from "../../../../components/ui/Icon.tsx";

export interface Props {
  alerts: AlertProps[];
  interval?: number;
}

function Alert({ alerts, interval = 10 }: Props) {
  const id = useId();
  if (!alerts || alerts.length === 0) return null;

  return (
    <div id={id} class="relative w-full px-[30px]">
      {/* Setas de navegação */}
      {alerts.length > 1 && (
        <>
          <div class="absolute top-1/2 left-0 z-10 -translate-y-1/2">
            <Slider.PrevButton class="w-8 h-8 flex justify-center items-center text-white  rounded-full disabled:opacity-0 transition-all">
              <Icon id="ChevronRight" class="w-5 rotate-180" />
            </Slider.PrevButton>
          </div>
          <div class="absolute top-1/2 right-0 z-10 -translate-y-1/2">
            <Slider.NextButton class="w-8 h-8 flex justify-center items-center text-white  rounded-full disabled:opacity-0 transition-all">
              <Icon id="ChevronRight" class="w-5" />
            </Slider.NextButton>
          </div>
        </>
      )}
      <Slider class="carousel w-full ">
        {alerts.map((alert, idx) => (
          <Slider.Item index={idx} class="carousel-item w-full">
            <AlertItem
              alert={alert}
              id={`alert-${id}-${idx}`}
              className="w-full"
            />
          </Slider.Item>
        ))}
      </Slider>
      <SliderJS rootId={id} interval={interval * 1000} infinite />
    </div>
  );
}

export default Alert;