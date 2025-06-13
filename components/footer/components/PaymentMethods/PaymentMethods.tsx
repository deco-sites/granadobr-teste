import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { getSizeIcons } from "./utils/index.ts";
import { Props } from "./types.ts";

const PaymentMethods = ({ content }: Props) => {
  return (
    <Show when={!!content?.items && content.items.length > 0}>
      <div class="flex flex-col gap-6 items-center px-4 lg:px-0 mt-9 md:mt-12 lg:mt-0">
        <Show when={!!content?.title}>
          <h3 class="hidden m-0 lg:block text-lg leading-5 text-white font-bold">
            {content?.title}
          </h3>
        </Show>

        <ul class="flex items-center justify-center gap-y-4 lg:gap-y-0 gap-x-6 flex-wrap">
          {content?.items.map((item) => (
            <li title={item.label} class="text-white" key={item.label}>
              <Icon
                id={item.label}
                width={getSizeIcons(item.label).width}
                height={getSizeIcons(item.label).height}
                strokeWidth={1}
              />
            </li>
          ))}
        </ul>
      </div>
    </Show>
  );
};

export default PaymentMethods;
