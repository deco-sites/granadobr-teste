import Show from "../../../../directives/Show/index.tsx";

import { preventXSS } from "../../../../sdk/format.ts";
import { Props } from "./types.ts";

const Notice = ({ content }: Props) => {
  return (
    <Show when={!!content && content.length > 0}>
      <div class="flex flex-col gap-3 mx-4 md:mx-0">
        {content?.map((section, index) => (
          <ul
            key={index}
            className="flex flex-col md:items-center text-white text-xs leading-[15px]"
          >
            {section.items?.map((item, index) => (
              <li key={index}>
                {item.htmlFormat
                  ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: preventXSS(item.label),
                      }}
                    />
                  )
                  : (
                    item.label
                  )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Show>
  );
};

export default Notice;
