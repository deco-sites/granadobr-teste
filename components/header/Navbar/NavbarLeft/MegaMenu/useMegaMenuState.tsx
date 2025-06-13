import { SiteNavigationElement } from "apps/commerce/types.ts";
import { useCallback, useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

interface UseMegaMenuStateProps {
  items: SiteNavigationElement[];
  onSelectItem: (item: SiteNavigationElement | null) => void;
  selectedMenuItem: SiteNavigationElement | null;
}

export function useMegaMenuState(
  { items, onSelectItem, selectedMenuItem }: UseMegaMenuStateProps,
) {
  const selectedItem = useSignal<SiteNavigationElement | null>(null);

  /**
   * Manipula a alternância do item, definindo o estado aberto do dropdown e selecionando o item.
   * @param {SiteNavigationElement} item - O item a ser alternado.
   */
  const handleItemToggle = useCallback(
    (item: SiteNavigationElement) => {
      if (item.children && item.children.length > 0) {
        selectedItem.value = item;
        onSelectItem(item);
      } else {
        globalThis.open(item.url, "_self");
      }
    },
    [onSelectItem],
  );

  const getSelectedItem = useCallback(() => {
    return selectedItem.value || selectedMenuItem || items.find((item) =>
      item.image && item.image.length > 0
    ) || null;
  }, [selectedItem.value, selectedMenuItem, items]);

  useEffect(() => {
    let selectedItem = getSelectedItem();

    if (selectedItem !== selectedMenuItem && selectedMenuItem !== null) {
      selectedItem = selectedMenuItem;
    }
    if (selectedItem) {
      handleItemToggle(selectedItem);
    }
  }, [selectedMenuItem, getSelectedItem, handleItemToggle]);

  return { selectedItem, handleItemToggle };
}
