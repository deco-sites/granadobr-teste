import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const SwitcherStore = ({ content }: Props) => {
  return (
    <Show when={!!content && content.length > 0}>
      <ul class="flex items-center flex-wrap md:px-4 lg:px-8 xl:container">
        {content?.map((item) => (
          <li
            key={item.label}
            class="w-1/3 md:w-auto first-of-type:bg-green-950 h-8"
            title={item.label}
          >
            {item.href
              ? (
                <a
                  href={item.href}
                  aria-label={`${item.label} Logo`}
                  class="text-white hover:bg-green-950 flex justify-center px-5 h-full transition-colors ease-in duration-200"
                  target={item.openInNewTab ? "_blank" : "_self"}
                >
                  {item.label === "Care"
                    ? (
                      <img
                        src="/image/logos/care.webp"
                        alt="Care"
                        class="object-contain"
                        width={60}
                        height={32}
                      />
                    )
                    : (
                      <Icon
                        height={34}
                        width={item.label === "Phebo" ? 55 : 72}
                        id={item.label}
                      />
                    )}
                </a>
              )
              : (
                <div class="text-white flex justify-center px-5">
                  <Icon
                    height={34}
                    width={item.label === "Phebo" ? 55 : 72}
                    id={item.label}
                  />
                </div>
              )}
          </li>
        ))}
      </ul>
    </Show>
  );
};

export default SwitcherStore;
