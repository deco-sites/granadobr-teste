import Show from "../../../../directives/Show/index.tsx";

import { preventXSS } from "../../../../sdk/format.ts";
import { Props } from "./types.ts";

const Info = ({ content }: Props) => {
  return (
    <Show when={!!content && content.length > 0}>
      <div class="flex flex-col gap-[14px] mx-4 md:mx-0">
        {content?.map((section) => (
          <ul class="flex flex-col md:items-center text-white text-sm leading-[18px]">
            {section.items?.map((item) => (
              <>
                {item.htmlFormat
                  ? (
                    <li
                      dangerouslySetInnerHTML={{
                        __html: preventXSS(item.label),
                      }}
                    />
                  )
                  : <li>{item.label}</li>}
              </>
            ))}
          </ul>
        ))}
      </div>
    </Show>
  );
};

export default Info;
