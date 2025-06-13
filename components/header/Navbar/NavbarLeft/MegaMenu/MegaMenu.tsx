import { useCallback } from "preact/hooks";
import { SiteNavigationElement } from "apps/commerce/types.ts";
import ImageRenderer from "./ImageRenderer.tsx";
import RenderedItems from "./RenderedItems.tsx";
import { useMegaMenuState } from "./useMegaMenuState.tsx";

interface MegaMenuProps {
  items: SiteNavigationElement[];
  onSelectItem: (item: SiteNavigationElement | null) => void;
  selectedMenuItem: SiteNavigationElement | null;
}

function MegaMenu({ items, onSelectItem, selectedMenuItem }: MegaMenuProps) {
  const { selectedItem, handleItemToggle } = useMegaMenuState({
    items,
    onSelectItem,
    selectedMenuItem,
  });

  const getClassNameForItem = useCallback(
    (item: SiteNavigationElement) => {
      return selectedItem && item.name === selectedItem.value?.name
        ? "bg-[#f6f3f8] text-green-900 font-medium"
        : "bg-white font-normal";
    },
    [selectedItem],
  );

  return (
    <div className="relative flex h-full text-black">
      <ul className=" flex-grow w-32 md:min-w-80 flex-shrink-0 overflow-y-auto">
        <RenderedItems
          items={items}
          handleItemToggle={handleItemToggle}
          getClassNameForItem={getClassNameForItem}
        />
      </ul>
      <div class="relative flex-grow w-full">
        {
          // selectedItem?.children && (
          items.map((item) => (
            <ul
              className={`flex-grow overflow-y-auto absolute inset-0 grid grid-cols-1 auto-rows-min lg:grid-cols-2 w-full bg-[#f6f3f8] ${
                selectedItem.value?.name === item.name ? "" : "hidden"
              }`}
              data-menu-id={item.identifier
                ? `menu-${item.identifier}`
                : undefined}
            >
              <li
                className={`order-2 md:order-1 flex  flex-col-reverse md:flex-col justify-between`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-6 gap-4 justify-items-center items-start px-8 py-6 md:py-11">
                  {item.children?.map((child) => (
                    <ImageRenderer
                      images={child.image || []}
                      name={child.name}
                      url={child.url}
                      width={74}
                      height={74}
                    />
                  ))}
                </div>
                <div className="flex justify-end md:justify-start order-1 md:order-3 inset-x-0 bottom-0 md:mb-4 ml-8 mr-4 pt-4 md:pt-0">
                  <a
                    href={item.url || "#"}
                    className="h-9 inline-block text-center bg-white border border-gray-300 text-black
              hover:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:outline-none rounded py-2 px-4 
              leading-tight transition-colors duration-150 cursor-pointer text-base font-matria font-normal"
                    rel="noopener noreferrer"
                  >
                    Ver tudo
                    <span aria-hidden="true" className="ml-2">
                      &rarr;
                    </span>
                  </a>
                </div>
              </li>
              <li className="order-3 lg:order-2 lg:grid lg:place-items-end hidden pr-8">
                <ImageRenderer
                  images={item.image || []}
                  name=""
                  url={item.url}
                  width={373}
                  height={546}
                />
              </li>
            </ul>
          ))

          // )
        }
      </div>
    </div>
  );
}

export default MegaMenu;
