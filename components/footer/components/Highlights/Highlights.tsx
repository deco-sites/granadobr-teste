import Icon from "../../../ui/Icon.tsx";

import Divider from "../Divider/index.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const Highlights = ({ content }: Props) => {
  return (
    <Show when={!!content && content.length > 0}>
      <div class="flex md:hidden flex-col items-center relative">
        <div class="flex flex-col gap-[1px]">
          {content?.map((highlight, index) => (
            <>
              <a
                href={highlight.href}
                aria-label={highlight.label}
                {...(highlight.openInNewTab && {
                  rel: "noopener noreferrer",
                  target: "_blank",
                })}
                class="flex items-center gap-8 text-white my-7 mx-4"
              >
                <Icon id={highlight.type} size={40} />

                <div class="flex flex-col gap-3">
                  <h3 class="text-lg leading-5 font-semibold m-0">
                    {highlight.label}
                  </h3>

                  <p class="text-base leading-4">{highlight.description}</p>
                </div>
              </a>

              <Divider
                class="absolute left-0"
                style={{
                  transform: `translateY(calc((100% / ${content.length}) * ${
                    index + 1
                  }))`,
                  top: `calc(((100% / ${content.length}) * ${
                    index + 1
                  }) - 1px)`,
                }}
              />
            </>
          ))}
        </div>
      </div>
    </Show>
  );
};

export default Highlights;
