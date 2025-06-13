import Icon from "../../components/ui/Icon.tsx";
import { Picture, Source } from "apps/website/components/Picture.tsx";

import type { ImageWidget } from "apps/admin/widgets.ts";
import {
  SendEventOnClick,
  SendEventOnView,
} from "site/components/Analytics.tsx";
import { useId } from "site/sdk/useId.ts";

interface Banner {
  srcMobile: ImageWidget;
  srcDesktop: ImageWidget;
  alt: string;
  label: string;
  description: string;
  href: string;

  /**
   * @description id for gtm tracking
   */
  promotionId: string;
}

export interface Props {
  banners: Banner[];
  /**
   * @description a unique identifier to use on trigger selectors in GTM
   */
  gtmListId?: string;
}

const BannerGrid = ({ banners, gtmListId }: Props) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section
      class="mx-4 md:mx-0 w-[calc(100%_-_32px)] md:w-full"
      data-gtm-list-id={gtmListId}
    >
      <div class="grid gap-2.5 grid-cols-1 md:grid-cols-[60%_40%] md:grid-rows-[280px_280px] w-full md:w-[calc(100%_-_10px)]">
        {banners.map((
          { href, srcMobile, srcDesktop, alt, label, description, promotionId },
          index,
        ) => {
          const id = useId();
          const params = {
            promotion_name: alt,
            position_slot: index + 1,
            creative_name: srcDesktop ?? srcMobile,
            promotion_id: promotionId,
          };
          return (
            <a
              key={index}
              aria-label={label}
              class="relative group overflow-hidden md:first-of-type:col-start-1 md:first-of-type:row-start-1 md:first-of-type:row-end-3 rounded md:rounded-none md:first-of-type:rounded-r md:first-of-type:rounded-l-none md:rounded-l min-h-44 h-44 md:h-full"
              href={href}
              id={id}
            >
              <div class="skeleton bg-gray-200 rounded md:rounded-none md:first-of-type:rounded-r md:first-of-type:rounded-l-none md:rounded-l pt-[40.93%] md:pt-0 md:group-first-of-type:pt-[69.51%] h-[280px] group-first-of-type:h-full w-full" />

              <Picture class="absolute inset-0 w-full h-full">
                <Source
                  width={430}
                  loading="lazy"
                  media="(max-width: 767px)"
                  src={srcMobile}
                  height={176}
                />
                <Source
                  width={1120}
                  loading="lazy"
                  media="(min-width: 768px)"
                  src={srcDesktop}
                  height={700}
                />
                <img
                  src={srcDesktop}
                  class="object-cover transition-transform duration-300 transform origin-center lg:group-hover:scale-105 w-full h-full"
                  loading="lazy"
                  alt={alt}
                />
              </Picture>

              <div class="absolute inset-0 rounded md:rounded-none md:group-first-of-type:rounded-r md:group-first-of-type:rounded-l-none md:rounded-l z-10 bg-gradient-to-t from-black to-transparent opacity-50" />

              <div class="absolute left-5 right-5 bottom-5 z-10 grid overflow-hidden grid-rows-[auto_1fr] lg:grid-rows-[auto_0fr] duration-300 lg:group-hover:grid-rows-[auto_1fr] transition-[grid-template-rows]">
                <h3 class="text-[32px] xl:text-5xl leading-none uppercase text-white font-granado font-medium m-0 break-all">
                  {label}
                </h3>

                <div class="visible lg:invisible col-start-1 row-start-2 min-h-0 transition-[visibility] duration-300 lg:group-hover:visible">
                  <div class="flex items-center gap-1.5 mt-1.5 text-white">
                    <span class="text-lg leading-[22px] hover:underline">
                      {description}
                    </span>

                    <Icon id="ArrowRight" size={16} class="mt-[3px]" />
                  </div>
                </div>
              </div>
              <SendEventOnClick
                id={id}
                event={{ name: "select_promotion", params }}
              />

              <SendEventOnView
                id={id}
                event={{ name: "view_promotion", params }}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default BannerGrid;
