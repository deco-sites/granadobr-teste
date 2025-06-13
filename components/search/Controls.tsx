import Button from "../../components/ui/Button.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import { useSignal } from "@preact/signals";
import type { ProductListingPage } from "apps/commerce/types.ts";
import Sort from "site/components/search/Sort.tsx";
import FiltersIsland from "site/islands/FiltersIsland.tsx";

export type Props =
  & Pick<ProductListingPage, "filters" | "breadcrumb" | "sortOptions">
  & {
    displayFilter?: boolean;
  };

function SearchControls(
  { filters, sortOptions, displayFilter = true }: Props,
) {
  const open = useSignal(false);

  return (
    <Drawer
      loading="lazy"
      open={open.value}
      onClose={() => open.value = false}
      aside={
        <>
          <div class="bg-base-100 flex flex-col w-full h-full overflow-y-hidden">
            <div class="flex justify-end items-center ">
              <Button class="btn btn-ghos" onClick={() => open.value = false}>
                <Icon id="XMark" size={16} strokeWidth={1} />
              </Button> 
            </div>
            <div class="flex-grow overflow-auto ">    
              <FiltersIsland filters={filters} />
            </div> 
          </div> 
        </>
      }
    >
      <div class="flex flex-col justify-between mb-4 p-0 sm:mb-0 sm:gap-4 sm:flex-row sm:h-[53px]">
        <div class="flex flex-row items-center sm:p-0 mb-2">
        </div>

        <div class="flex flex-row items-center justify-between sm:gap-4 sm:border-none">
          <Button
            class={displayFilter
              ? "btn-ghost bg-[#025A44] text-white"
              : "btn-ghost sm:hidden border border-solid border-gray-200 rounded min-h-10 h-10 bg-[#025A44] text-white"}
            onClick={() => {
              open.value = true;
            }}
          >
            <Icon id="FilterList" width={16} height={16} class="invert-[1]"/>
            Filtrar
          </Button>

          {sortOptions.length > 0 && <Sort sortOptions={sortOptions} />}
        </div>
      </div>
    </Drawer>
  );
}

export default SearchControls;
