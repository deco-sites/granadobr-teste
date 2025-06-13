import type { ImageObject, Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useEffect, useMemo } from "preact/hooks";
import { useSignal } from "@preact/signals";
import Wishlist from "site/components/header/Navbar/NavBarRight/Wishlist.tsx";
import ProductImageZoom from "site/components/product/ProductImageZoom.tsx";
import SliderCarousel from "site/components/ui/SliderCarousel.tsx";
import { useModal } from "site/islands/ModalProvider.tsx";
import Slider from "../../../components/ui/Slider.tsx";
import { ShareButton } from "../../../islands/ProductShareModal.tsx";
import SliderJS from "../../../islands/SliderJS.tsx";
import { useId } from "../../../sdk/useId.ts";

export interface Props {
  /** @title Integration */
  images: Product["image"];

  layout?: {
    width: number;
    height: number;
  };
}

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on desktop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider({ images, layout }: Props) {
  images ??= [];
  const id = useId();
  const { setIsModalOpen, setCurrentIndex } = useModal();

  const isMobile = useSignal(false);

  useEffect(() => {
    globalThis.addEventListener("resize", () => {
      isMobile.value = globalThis.innerWidth <= 768;
    });
  }, []);

  const openModal = () => {
    setTimeout(() => {
      setIsModalOpen(true);
    }, 400);
  };

  const { width, height } = layout || { width: 300, height: 370 };
  const aspectRatio = `${width} / ${height}`;
  const filteredImage = useMemo(() => images.slice(0, 4), [images]);

  function renderImage({ img, index }: { img: ImageObject; index: number }) {
    return (
      <div className="relative w-full h-full">
        <Image
          onClick={() => openModal()}
          onMouseOver={() => setCurrentIndex(index)}
          className="w-full md:rounded-[5px] md:border-[1px] md:border-[#d9d9d9]"
          sizes="(max-width: 640px) 100vw, 40vw"
          style={{ aspectRatio }}
          src={img.url || "#"}
          alt={img.alternateName}
          width={width}
          height={height}
          fetchPriority={index === 0 ? "high" : "low"}
          preload={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
    );
  }
  return (
    <div id={id}>
      <ul className="md:grid hidden md:grid-cols-2 md:gap-2.5">
        {filteredImage.map((img, index) => (
          <li className="w-full cursor-pointer">
            {renderImage({ img, index })}
          </li>
        ))}
      </ul>

      <div
        className={`sticky grid md:hidden w-full h-full 
        grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] 
        grid-rows-[1fr_48px_1fr_64px]`}
        style={{ aspectRatio }}
      >
        <Slider className="carousel carousel-center w-full h-full col-span-full row-span-full gap-6 overflow-y-hidden md:overflow-hidden">
          {filteredImage.map((img, index) => (
            <Slider.Item
              index={index}
              className="carousel-item w-full h-full"
            >
              {renderImage({ img, index })}
            </Slider.Item>
          ))}
          <div className="absolute bottom-5 z-20 left-0 right-0 flex justify-between px-4 md:hidden">
            <Wishlist />
            <ShareButton />
          </div>
        </Slider>

        <SliderCarousel
          images={filteredImage}
          dots
          dotStyle="bg-gray-300 group-disabled:bg-gray-500"
        />

        <SliderJS rootId={id} />
      </div>

      {!isMobile.value && (
        <ProductImageZoom
          images={filteredImage}
          width={768}
          height={Math.trunc((785 * height) / width)}
        />
      )}
    </div>
  );
}
