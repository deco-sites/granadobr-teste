import { memo } from "preact/compat";
import NavItem from "./NavItem.tsx";
import { SiteNavigationElement } from "apps/commerce/types.ts";

const NavItemMemo = memo(NavItem);

interface RenderedItemsProps {
  items: SiteNavigationElement[];
  handleItemToggle: (item: SiteNavigationElement) => void;
  getClassNameForItem: (item: SiteNavigationElement) => string;
}

function RenderedItems({
  items,
  handleItemToggle,
  getClassNameForItem,
}: RenderedItemsProps) {
  return (
    <>
      {items.map((item) => {
        const itemClasses = getClassNameForItem(item);
        const handleItemClick = (e: MouseEvent) => {
          e.preventDefault();
          handleItemToggle(item);
        };

        return (
          <li
            key={item.name}
            className={`group flex items-center cursor-pointer  ${itemClasses}`}
          >
            <NavItemMemo
              item={item}
              isMainMenu={false}
              onDropdownToggle={handleItemClick}
            />
          </li>
        );
      })}
    </>
  );
}

export default RenderedItems;
