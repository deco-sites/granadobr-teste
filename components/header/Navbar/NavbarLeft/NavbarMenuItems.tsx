import { useSignal } from "@preact/signals";
import { useCallback, useMemo } from "preact/hooks";
import { SiteNavigationElement } from "site/components/header/types.ts";
import DropdownToggle from "./MegaMenu/DropdownToggle.tsx";
import MegaMenu from "./MegaMenu/MegaMenu.tsx";
import NavItem from "./MegaMenu/NavItem.tsx";

export interface Props {
  items: SiteNavigationElement[];
  logoPosition: "left" | "center";
}

function NavbarMenuItems({ items }: Props) {
  const selectedItem = useSignal<SiteNavigationElement | null>(null);

  const filteredHeaderItems = useMemo(
    () =>
      items
        .filter(
          (item) =>
            (item.url || (item.children && item.children.length > 0)) &&
            item.headerConfig?.displayInHeader,
        )
        .map((item, index) => ({ ...item, originalIndex: index }))
        .sort((a, b) => {
          if (!a.headerConfig && !b.headerConfig) return 0;
          if (!a.headerConfig) return 1;
          if (!b.headerConfig) return -1;

          const orderDiff = a.headerConfig.headerOrder -
            b.headerConfig.headerOrder;
          if (orderDiff !== 0) return orderDiff;

          return a.originalIndex - b.originalIndex;
        }),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.url || (item.children && item.children.length > 0)) &&
          item.megamenuConfig?.displayInMegamenu,
      ),
    [items],
  );

  const handleDropdownToggle = useCallback(
    (event: MouseEvent, item?: SiteNavigationElement) => {
      if (item && item.children && item.children?.length > 0) {
        event.preventDefault();
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
      <ul className="flex items-center gap-6 col-span-1">
        <li>
          <DropdownToggle />
        </li>

        {filteredHeaderItems.slice(0, 5).map((item) => (
          <li key={item.name} className="hidden xl:flex items-center">
            <NavItem
              item={item}
              isMainMenu
              onDropdownToggle={(event) =>
                handleDropdownToggle(event as MouseEvent, item)}
            />
          </li>
        ))}
      </ul>

      <input
        id="mega-menu-dropdown"
        type="checkbox"
        data-dropdown-open="false"
        class="hidden peer"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const el = document.getElementById("mega-menu-dropdown");
            el?.addEventListener("change", (e) => {
              const target = e.target;
              target.setAttribute(
                "data-dropdown-open",
                target.checked.toString(),
              );
            });
          `,
        }}
      />
      <div
        className={`fixed h-[63vh] left-0 mt-4 2xl:mt-6 w-full xl:w-4/5 bg-white z-50 overflow-hidden transition duration-300 ease-in-out peer-checked:translate-y-0 peer-checked:opacity-100 peer-checked:pointer-events-auto -translate-y-full opacity-0 pointer-events-none`}
      >
        <MegaMenu
          items={filteredItems}
          // @ts-expect-error check typing
          onSelectItem={(item) => selectedItem.value = item}
          selectedMenuItem={selectedItem.value}
        />
      </div>
    </div>
  );
}

export default NavbarMenuItems;
