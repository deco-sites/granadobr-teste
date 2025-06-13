import { SiteNavigationElement } from "apps/commerce/types.ts";
import { useCallback, useEffect } from "preact/hooks";
import MegaMenu from "site/components/header/Navbar/NavbarLeft/MegaMenu/MegaMenu.tsx";
import { useSignal } from "@preact/signals";

interface Props {
  items: SiteNavigationElement[];
  isSelectedItem?: SiteNavigationElement | null;
}

const MegaMenuContainer = ({ items, isSelectedItem }: Props) => {
  const selectedItem = useSignal<SiteNavigationElement | null>(null);

  useEffect(() => {
    if (isSelectedItem) selectedItem.value = isSelectedItem;
  }, [isSelectedItem]);

  const handleDropdownToggle = useCallback(
    (item?: SiteNavigationElement) => {
      if (item && item.image && item.image.length > 0) {
        const el = document.getElementById("mega-menu-dropdown") as
          | HTMLInputElement
          | null;
        if (selectedItem.value && selectedItem.value.name === item.name) {
          if (!el) return;
          el.checked = !el.checked;
        } else {
          selectedItem.value = item;
          if (!el) return;
          el.checked = true;
        }
      }
    },
    [selectedItem],
  );

  return (
    <div className="relative">
      <div
        className={`fixed left-0 mt-6 w-full xl:w-4/5 bg-white z-50 overflow-hidden transition duration-300 ease-in-out ${
          "[body:has(data-dropdown-open=true)_&]:translate-y-0 [body:has(data-dropdown-open=true)_&]:opacity-100 [body:has(data-dropdown-open=true)_&]:pointer-events-auto" +
          "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <MegaMenu
          items={items}
          onSelectItem={(item) => selectedItem.value = item}
          selectedMenuItem={selectedItem.value}
          // @ts-expect-error check typing
          onDropdownToggle={handleDropdownToggle}
        />
      </div>
    </div>
  );
};

export default MegaMenuContainer;
