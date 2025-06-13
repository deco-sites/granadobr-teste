import { Picture, Source } from "apps/website/components/Picture.tsx";
import { SendEventOnClick, SendEventOnView } from "../../../Analytics.tsx";

import { Props } from "./types.ts";
import { useId } from "site/sdk/useId.ts";

const Item = ({
  desktop,
  preload,
  mobile,
  index,
  promotionId,
  alt,
}: Props) => {
  const params = {
    promotion_name: alt,
    position_slot: index + 1,
    creative_name: desktop ?? mobile,
    promotion_id: promotionId,
  };
  const lcp = index === 0 && preload;
  const id = useId();

  return (
    <>
      <div class="skeleton bg-gray-200 h-full w-full rounded-none pt-[53.33%] md:pt-[26.04%]" />

      <Picture
        preload={lcp}
        loading={lcp ? "eager" : "lazy"}
        class="absolute inset-0"
        id={id}
      >
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={750}
          height={400}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1920}
          height={500}
        />
        <img
          class="w-full"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>

      <SendEventOnClick
        id={id}
        event={{ name: "select_promotion", params }}
      />

      <SendEventOnView
        id={id}
        event={{ name: "view_promotion", params }}
      />
    </>
  );
};

export default Item;
