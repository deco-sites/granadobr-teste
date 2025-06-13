import { useSignal } from "@preact/signals";
import { useEffect, useMemo, useRef } from "preact/hooks";
import MegaMenu from "site/components/header/Navbar/NavbarLeft/MegaMenu/MegaMenu.tsx";
import { SiteNavigationElement } from "site/components/header/types.ts";

export interface Props {
  items: SiteNavigationElement[];
}

function ProdutosModal({ items }: Props) {
  const focusRef = useRef<HTMLDivElement>(null);
  const selectedItem = useSignal<SiteNavigationElement | null>(null);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.url || (item.children && item.children.length > 0)) &&
          item.megamenuConfig?.displayInMegamenu,
      ),
    [items],
  );
  useEffect(() => {
    if (!selectedItem.value) selectedItem.value = filteredItems[0];
  }, [selectedItem, filteredItems]);

  return (
    <div
      ref={focusRef}
      tabIndex={0}
      className="w-screen h-[calc(100vh-80px)] flex-1"
    >
      <MegaMenu
        items={filteredItems}
        // @ts-expect-error check typing
        onSelectItem={(item) => selectedItem.value = item}
        selectedMenuItem={selectedItem.value}
      />
    </div>
  );
}

export default ProdutosModal;
