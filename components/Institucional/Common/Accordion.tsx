import { useCallback } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { useSignal } from "@preact/signals";

/**
 * @title {{{title}}}
 */
export interface AccordionItem {
  /** @title Title */
  title: string;

  /**
   * @title Content
   * @format rich-text
   * @description Page content
   */
  content: string;
}

export interface Props {
  items: AccordionItem[];
  customStyles?: {
    container?: string;
    classItem?: string;
    header?: string;
    content?: string;
    icon?: string;
  };
}

function Accordion({ items, customStyles }: Props) {
  const activeTab = useSignal<AccordionItem | null>(null);

  const handleItemClick = useCallback(
    (item: AccordionItem) => {
      activeTab.value = activeTab.value?.title === item.title ? null : item;
    },
    [],
  );

  const {
    container = "w-full md:w-[824px] pt-5 md:pt-10",
    classItem =
      "py-5 px-4 flex flex-row justify-between items-center border-t-[1px] border-green-950 text-green-800 text-lg font-matria font-bold",
    content = "text-base px-4 pb-4 text-[#333333] font-matria",
    icon =
      "text-sm 2xl:text-[17px] font-matria font-normal h-[20px] w-[20px] 2xl:h-[24px] 2xl:w-[24px]",
  } = customStyles || {};

  return (
    <ul className={container}>
      {items.map((item, index) => (
        <li key={index}>
          <div
            className={`${classItem} ${
              index === items.length - 1 &&
                activeTab.value?.title !== item.title
                ? "border-b-[1px]"
                : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item.title}
            <Icon
              id="ChevronUp"
              strokeWidth={0.01}
              className={`${icon} ${
                activeTab.value?.title === item.title
                  ? "rotate-0"
                  : "rotate-180"
              }`}
            />
          </div>
          {activeTab.value?.title === item.title && (
            <div
              className={`${content} ${
                index === items.length - 1 &&
                  activeTab.value?.title === item.title
                  ? "border-b-[1px] border-green-950"
                  : ""
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default Accordion;
