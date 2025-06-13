import Modal from "site/components/ui/Modal.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { useId } from "site/sdk/useId.ts";
import type { ImageObject } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import SliderJSV2 from "site/islands/SliderJSV2.tsx";
import SliderCarousel from "site/components/ui/SliderCarousel.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useModal } from "site/islands/ModalProvider.tsx";
import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";

const isUIVisible = signal<boolean>(false);
const localIsModalOpen = signal<boolean>(false);

export interface Props {
  images: ImageObject[];
  width: number;
  height: number;
}

function ProductImageZoom({ images, width, height }: Props) {
  const id = useId();
  const { currentIndex, isModalOpen, setIsModalOpen } = useModal();

  let timerId = 0;

  const aspectRatio = `${width} / ${height}`;

  const hideUI = () => {
    isUIVisible.value = false;
  };

  const resetTimer = () => {
    if (localIsModalOpen.value) {
      if (!isUIVisible.value) {
        isUIVisible.value = true;
      }
      clearTimeout(timerId);
      timerId = setTimeout(hideUI, 3000);
    }
  };

  useEffect(() => {
    const events = ["mousemove", "click", "keydown"];

    const resetTimerHandler = () => resetTimer();

    events.forEach((event) =>
      document.addEventListener(event, resetTimerHandler)
    );
    resetTimer();

    return () => {
      clearTimeout(timerId);
      events.forEach((event) =>
        document.removeEventListener(event, resetTimerHandler)
      );
    };
  }, []);

  //for some strange reason, isModalOpen dont works if used outside this effect
  useEffect(() => {
    localIsModalOpen.value = isModalOpen;
    if (isModalOpen) {
      clearTimeout(timerId);
      timerId = setTimeout(hideUI, 3000);
    }
  }, [isModalOpen]);

  return (
    <div id={id}>
      <Modal
        loading="lazy"
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          clearTimeout(timerId);
        }}
      >
        <div
          class={`fixed inset-0 z-50 grid grid-cols-[120px_1fr_120px] grid-rows-[48px_1fr_48px_1fr_64px] 
          place-items-center bg-black text-white`}
        >
          <div
            className={`fixed flex justify-between top-0 right-0 w-full bg-black bg-opacity-50  transition duration-300 ease-in-out ${
              !isUIVisible.value
                ? "-translate-y-full opacity-0"
                : "translate-y-0  opacity-100"
            }`}
          >
            <div class={`pl-5 pt-3 text-xs tx-mr-eaves-xl-sans`}>
              {currentIndex + 1}/{images.length}
            </div>
            <button
              className="p-2"
              aria-label={`close`}
              type={`button`}
              onClick={() => setIsModalOpen(false)}
            >
              <Icon
                id="XMark"
                strokeWidth={0.01}
                className={`h-[24px] w-[24px]`}
              />
            </button>
          </div>

          <Slider class="carousel col-span-full col-start-1 row-start-1 row-span-full h-full w-full overflow-x-auto">
            {images.map((image, index) => {
              return (
                <Slider.Item
                  key={index}
                  index={index}
                  class="carousel-item w-full h-full justify-center items-center"
                >
                  <Image
                    src={image.url || "#"}
                    alt={image.alternateName}
                    width={width}
                    height={height}
                    style={{ aspectRatio }}
                  />
                </Slider.Item>
              );
            })}
          </Slider>

          <SliderCarousel
            images={images}
            dots={false}
            arrows
            dotStyle={`bg-gray-300 group-disabled:bg-gray-500`}
            nextButtonStyle={`bg-transparent shadow-none text-gray-500 ${
              !isUIVisible.value ? "opacity-0" : "opacity-100"
            }`}
            prevButtonStyle={`bg-transparent shadow-none text-gray-500 ${
              !isUIVisible.value ? "opacity-0" : "opacity-100"
            }`}
            buttonIconStyle={`w-[25px] h-[20px] ml-2 mr-2`}
          />

          <SliderJSV2 rootId={id} initialIndex={currentIndex} infinite />
        </div>
      </Modal>
    </div>
  );
}

export default ProductImageZoom;
