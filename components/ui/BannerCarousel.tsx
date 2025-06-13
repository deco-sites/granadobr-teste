import {
  SendEventOnClick,
  SendEventOnView,
} from "../../components/Analytics.tsx";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "../../sdk/useId.ts";
import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import SliderCarousel from "site/components/ui/SliderCarousel.tsx";

interface ImageAction {
  href: string;
  label: string;
}

interface VideoAction {
  href: string;
  label: string;
}

interface EmbedAction {
  href: string;
  title?: string;
  subTitle?: string;
  label: string;
  /**
   * @description id for gtm tracking
   */
  promotionId: string;
}

type ImageActionOption = ImageAction | undefined;
type VideoActionOption = VideoAction | undefined;
type EmbedActionOption = EmbedAction | undefined;

interface ImageBanner {
  desktop: ImageWidget;
  mobile: ImageWidget;
  alt?: string;
  action?: ImageActionOption;
  /**
   * @description id for gtm tracking
   */
  promotionId: string;
}

interface VideoBanner {
  videoUrl: VideoWidget;
  videoUrlMobile: VideoWidget;
  alt?: string;
  action?: VideoActionOption;
}

interface EmbedBanner {
  embedUrl: string;
  alt?: string;
  action?: EmbedActionOption;
}

export type Banner = ImageBanner | VideoBanner | EmbedBanner;

export interface Props {
  images: Banner[];
  preload?: boolean;
  arrows?: boolean;
  dots?: boolean;
  interval?: number;
  gtmIdentifier?: string;
}

const constructEmbedUrl = (videoUrl: string): string => {
  const baseEmbedUrl = videoUrl.includes("/watch?v=")
    ? videoUrl.replace("/watch?v=", "/embed/")
    : videoUrl;

  const videoId = videoUrl.split("v=")[1].split("&")[0];
  return `${baseEmbedUrl}?playlist=${videoId}&controls=0&cc_load_policy=0&autoplay=1&mute=1&rel=0&disablekb=1&loop=1&modestbranding=1&showinfo=0&fs=0`;
};

const renderEmbed = (embedUrl: string, alt?: string) => (
  <div className="relative w-full h-full overflow-hidden">
    <iframe
      title={alt || "Video"}
      className="absolute w-[350%] md:w-[105%] min-w-[186.66vh] h-[105%] min-h-[150%] top-1/2 left-1/2 object-cover translate-x-[-50%] translate-y-[-50%] aspect-video"
      src={embedUrl}
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    >
    </iframe>
  </div>
);

const renderImage = (
  desktop: ImageWidget,
  mobile: ImageWidget,
  lcp?: boolean,
  alt?: string,
) => (
  <>
    <div class="skeleton bg-gray-200 h-full w-full rounded-none aspect-[412/717] md:aspect-[16/9]" />

    <Picture
      preload={lcp}
      loading={lcp ? "eager" : "lazy"}
      class="absolute inset-[-1px]"
    >
      <Source
        media="(max-width: 767px)"
        srcSet={`${mobile} 1x, ${mobile}@2x 2x`}
        sizes="100vw"
        src={mobile}
        width={824 / 2}
        height={1434 / 2}
        type="image/webp"
        fetchPriority={lcp ? "high" : "low"}
      />
      <Source
        media="(min-width: 768px)"
        srcSet={`${desktop} 1x, ${desktop}@2x 2x`}
        sizes="100vw"
        src={desktop}
        width={1920 / 2}
        height={1080 / 2}
        type="image/webp"
        fetchPriority={lcp ? "high" : "low"}
      />

      <img
        className="object-cover w-full h-full md:h-fit"
        loading={lcp ? "eager" : "lazy"}
        src={desktop}
        alt={alt}
      />
    </Picture>
  </>
);

const renderVideo = (
  videoUrl: VideoWidget,
  videoUrlMobile: VideoWidget,
  lcp?: boolean,
  alt?: string,
) => (
  <>
    <video
      loading={lcp ? "eager" : "lazy"}
      preload={lcp ? "true" : "auto"}
      muted
      autoPlay
      loop
      class="object-cover"
      alt={alt || "Video"}
    >
      <source
        media="(max-width: 767px)"
        src={videoUrlMobile}
        width={824 / 2}
        height={1434 / 2}
      />
      <source
        media="(min-width: 768px)"
        src={videoUrl}
        width={1920 / 2}
        height={1080 / 2}
      />
    </video>
  </>
);

const BannerItem = ({
  image,
  lcp,
  id,
}: {
  image: Banner;
  lcp?: boolean;
  id: string;
}) => {
  const { action } = image;

  const Element = action?.href ? "a" : "div";
  const ariaLabel = `${action?.label}`;
  const commonProps = {
    id: `${id}-${action?.href ? "link" : "div"}`,
    "aria-label": ariaLabel,
    className: "relative w-full h-full",
  };

  if ("desktop" in image && "mobile" in image) {
    return (
      <Element {...commonProps} {...(action?.href && { href: action?.href })}>
        {renderImage(image.desktop, image.mobile, lcp, image.alt)}
      </Element>
    );
  }

  if ("videoUrl" in image && "videoUrlMobile" in image) {
    return (
      <Element {...commonProps} {...(action?.href && { href: action?.href })}>
        {renderVideo(image.videoUrl, image.videoUrlMobile, lcp, image.alt)}
      </Element>
    );
  }

  const renderMedia = () => {
    if ("embedUrl" in image) {
      return (
        <>
          {renderEmbed(constructEmbedUrl(image.embedUrl), image.alt)}
          {image.action && (
            <div className="absolute h-full top-0 md:bottom-[80px] left-1/2 transform -translate-x-1/2 right-0 w-full md:max-w-[624px] flex flex-col justify-end items-center gap-8 px-8 pt-12 pb-24 md:pb-32 z-10 text-center ">
              <span className="text-[40px] xl:text-5xl font-semibold text-base-100 font-granado uppercase">
                {image.action.title}
              </span>
              <span className="text-base font-normal text-base-100 tk-mr-eaves-xl-sans">
                {image.action.subTitle}
              </span>
              <button
                className="bg-white hover:bg-green-800 font-bold py-2 px-4 rounded mt-5 border border-green-800 text-green-800 hover:text-white shadow relative z-20 text-lg font-serif w-56 h-14"
                aria-label="Discover more about Bossa"
              >
                <span className="font-normal whitespace-nowrap tk-mr-eaves-xl-sans">
                  {image.action.label}
                </span>
              </button>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Element {...commonProps} {...(action?.href && { href: action?.href })}>
      {renderMedia()}
    </Element>
  );
};
const BannerCarousel = (props: Props) => {
  const id = useId();
  const { images, preload, interval } = props;

  return (
    <>
      <div
        id={id}
        data-gtm-id={props.gtmIdentifier}
        className="sticky grid w-full h-full grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px] aspect-w-9 aspect-h-16 md:aspect-video"
      >
        <Slider className="carousel carousel-center w-full h-full col-span-full row-span-full overflow-y-hidden md:overflow-hidden">
          {images.map((image, index) => {
            const params = {
              promotion_name: image.alt,
              promotion_slot: index + 1,
              creative_name: image.action?.href ?? image.action?.label,
            };
            const itemId = `${id}-${index.toString()}`;
            return (
              <Slider.Item
                key={index}
                index={index}
                className="carousel-item w-screen relative"
                id={itemId}
              >
                <BannerItem
                  image={image}
                  lcp={index === 0 && preload}
                  id={itemId}
                />
                <SendEventOnClick
                  id={itemId}
                  event={{ name: "select_promotion", params }}
                />
                <SendEventOnView
                  id={itemId}
                  event={{ name: "view_promotion", params }}
                />
              </Slider.Item>
            );
          })}
        </Slider>

        <SliderCarousel
          {...props}
          dotStyle="bg-gray-300 group-disabled:bg-gray-500"
          nextButtonStyle="bg-transparent shadow-none text-gray-500"
          prevButtonStyle="bg-transparent shadow-none text-gray-500"
          buttonIconStyle="w-[25px] h-[20px] ml-2 mr-2"
        />

        <SliderJS
          rootId={id}
          infinite
          interval={interval ? interval * 1000 : undefined}
        />
      </div>
    </>
  );
};

export default BannerCarousel;
