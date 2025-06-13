import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const SectionsLinks = ({ content }: Props) => {
  return (
    <Show when={content.length > 0}>
      {content.map((section) => (
        <div
          class="hidden md:flex flex-col gap-4 lg:gap-6 text-white"
          data-footer-menu=""
        >
          <span class="font-bold text-lg">{section.label}</span>

          <ul class="flex flex-col flex-wrap text-sm">
            {section.items?.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  {...(item.openInNewTab && {
                    rel: "noopener noreferrer",
                    target: "_blank",
                  })}
                  class="block link link-hover text-base leading-6"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <ul class="flex flex-col md:hidden">
        {content.map((section) => (
          <li class="px-4 py-6 text-white border-b border-green-200">
            <div class="collapse rounded-none">
              <input
                type="checkbox"
                id={section.label}
                class="peer min-h-[0]"
              />

              <label
                htmlFor={section.label}
                class="collapse-title min-h-[0] !p-0 text-lg leading-5"
              >
                <span class="font-semibold">{section.label}</span>
              </label>

              <div class="absolute top-1 right-0 transition-transform ease-in duration-300 peer-checked:rotate-180">
                <Icon size={12} id="ChevronDown" />
              </div>

              <div class="collapse-content !p-0">
                <ul class="flex flex-col mt-6">
                  {section.items?.map((item) => (
                    <li>
                      <a
                        href={item.href}
                        aria-label={item.label}
                        {...(item.openInNewTab && {
                          rel: "noopener noreferrer",
                          target: "_blank",
                        })}
                        class="block link link-hover text-base leading-6"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Show>
  );
};

export default SectionsLinks;
