import { ComponentChildren } from "preact";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  children: ComponentChildren;
  maxHeight?: number;
}

function SeeMore({ children, maxHeight = 70 }: Props) {
  return (
    <div class="border border-solid border-[#CCCCCC] rounded py-6 px-12 mb-4">
      <input type="checkbox" id="show-more" className="hidden peer" />
      <div
        style={{ "--max-height": `${maxHeight}px` }}
        class="grid grid-rows-[var(--max-height)] transition-[grid-template-rows] duration-500 ease-in-out peer-checked:grid-rows-1"
      >
        <div class="overflow-hidden">
          {children}
        </div>
      </div>
      <label
        for="show-more"
        class="text-gray-950 font-medium text-base flex gap-2 items-center peer-checked:[&>svg]:rotate-180 peer-checked:[&>.see-more]:hidden peer-checked:[&>.see-less]:inline"
      >
        <Icon
          id="ChevronDown"
          size={12}
          strokeWidth={2}
          class="transition-transform duration-300 "
        />
        <span class="see-more">
          Ver mais
        </span>
        <span class="see-less hidden">
          Ver menos
        </span>
      </label>
    </div>
  );
}

export default SeeMore;
