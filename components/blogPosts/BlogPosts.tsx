import SliderJS from "../../islands/SliderJS.tsx";
import Slider from "../../components/ui/Slider.tsx";

import Icon from "../../components/ui/Icon.tsx";
import Show from "../../directives/Show/index.tsx";

import Post from "./components/Post/index.tsx";
import { useId } from "../../sdk/useId.ts";

import { clx } from "site/sdk/clx.ts";
import { Props } from "./types.ts";

const BlogPosts = ({ posts, layout, description, title }: Props) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const id = useId();

  const numSlidesDesktop = layout?.numberOfSliders?.desktop ?? 3;
  const numSlidesMobile = layout?.numberOfSliders?.mobile ?? 2;

  const slideStyle = {
    mobile: {
      1: "w-full",
      2: "w-[calc(50%_-_8px)]",
      3: "w-[calc((100%_/_3)_-_11px)]",
      4: "w-[calc(25%_-_12px)]",
      5: "w-[calc(20%_-_13px)]",
    },
    desktop: {
      1: "md:w-full",
      2: "md:w-[calc(50%_-_8px)] lg:w-[calc(50%_-_12px)]",
      3: "md:w-[calc((100%_/_3)_-_11px)] lg:w-[calc((100%_/_3)_-_16px)]",
      4: "md:w-[calc(25%_-_12px)] lg:w-[calc(25%_-_18px)]",
      5: "md:w-[calc(20%_-_13px)] lg:w-[calc(20%_-_20px)]",
    },
  };

  const dotStyle = {
    mobile: {
      1: "[&:nth-child(1n+1)]:block md:[&:nth-child(1n+1)]:hidden",
      2: "[&:nth-child(2n+1)]:block md:[&:nth-child(2n+1)]:hidden",
      3: "[&:nth-child(3n+1)]:block md:[&:nth-child(3n+1)]:hidden",
      4: "[&:nth-child(4n+1)]:block md:[&:nth-child(4n+1)]:hidden",
      5: "[&:nth-child(5n+1)]:block md:[&:nth-child(5n+1)]:hidden",
    },
    desktop: {
      1: "md:[&:nth-child(1n+1)]:!block",
      2: "md:[&:nth-child(2n+1)]:!block",
      3: "md:[&:nth-child(3n+1)]:!block",
      4: "md:[&:nth-child(4n+1)]:!block",
      5: "md:[&:nth-child(5n+1)]:!block",
    },
  };

  return (
    <div class="w-full max-w-screen-4xl 4xl:mx-auto">
      <div
        id={id}
        class="flex flex-col pb-7 pt-9 md:py-10"
      >
        <Show when={!!title || !!description}>
          <div class="flex flex-col gap-4 mb-8 mx-4 md:mx-6 lg:mx-12 2xl:mx-16">
            <Show when={!!title}>
              <div class="font-granado text-5xl text-green-800 text-center">
                {title}
              </div>
            </Show>

            <Show when={!!description}>
              <span class="font-matria text-lg leading-none text-gray-950 text-center">
                {description}
              </span>
            </Show>
          </div>
        </Show>

        <div class="font-matria flex flex-col mx-4 md:mx-6 lg:mx-12 2xl:mx-16">
          <div class="grid relative">
            <Slider class="carousel gap-4 row-start-2 row-end-5 lg:gap-6">
              {posts?.map((post, index) => (
                <Slider.Item
                  index={index}
                  class={clx(
                    "carousel-item rounded items-baseline",
                    slideStyle.desktop[numSlidesDesktop],
                    slideStyle.mobile[numSlidesMobile],
                  )}
                >
                  <Post {...post} />
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

              <div class="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10">
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
                posts.length > numSlidesMobile ? "" : "hidden"
              } ${posts.length > numSlidesDesktop ? "" : "md:hidden"}`}
            >
              {posts.map((_, index) => (
                <li
                  key={index}
                  class={clx(
                    "carousel-item hidden leading-[0]",
                    dotStyle.mobile[numSlidesMobile],
                    dotStyle.desktop[numSlidesDesktop],
                  )}
                >
                  <Slider.Dot index={index}>
                    <div class="w-[34px] md:w-[54px] h-[5px] rounded bg-gray-300 group-disabled:bg-green-800" />
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

export default BlogPosts;
