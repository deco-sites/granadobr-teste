import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const Social = ({ content }: Props) => {
  return (
    <Show when={!!content?.items && content.items.length > 0}>
      <div
        class="flex flex-col gap-6 mx-4 lg:mx-0 mt-10 md:mt-8 lg:mt-0 md:w-full lg:w-auto"
        data-id="social"
      >
        <Show when={!!content?.title}>
          <h3 class="hidden lg:block font-semibold text-lg text-white m-0">
            {content?.title}
          </h3>
        </Show>

        <ul class="flex flex-wrap gap-2 justify-center lg:gap-3 lg:flex-col items-center lg:items-start">
          {content?.items.map((item) => (
            <li key={item.label}>
              <a
                target="_blank"
                href={item.link}
                rel="noopener noreferrer"
                class="flex gap-3 items-center hover:underline underline-offset-1 text-white"
                aria-label={`${item.label} Logo`}
              >
                <span class="block">
                  <Icon
                    class="w-10 lg:w-[30px] h-10 lg:h-[30px]"
                    id={item.label}
                  />
                </span>

                <div class="text-base hidden lg:block">{item.label}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Show>
  );
};

export default Social;
