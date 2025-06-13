import { useMemo } from "preact/hooks";
import { ProductListingPage } from "apps/commerce/types.ts";
import type { JSX } from "preact";
import Icon from "site/components/ui/Icon.tsx";
import { sendEvent } from "site/sdk/analytics.tsx";

const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";

const useSort = () =>
  useMemo(() => {
    const urlSearchParams = new URLSearchParams(
      globalThis?.location?.search,
    );
    return urlSearchParams.get(SORT_QUERY_PARAM) ?? "";
  }, []);

// TODO: Replace with "search utils"
const applySort = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
  const urlSearchParams = new URLSearchParams(
    globalThis?.location?.search,
  );

  urlSearchParams.delete(PAGE_QUERY_PARAM);
  urlSearchParams.set(SORT_QUERY_PARAM, e.currentTarget.value);

  sendEvent(
    {
      name: "button_click",
      params: {
        click_category: "category",
        click_text: "clique-ordenar-categoria",
        click_description: e.currentTarget.value,
      },
    },
  );

  if (globalThis?.location) {
    globalThis.location.search = urlSearchParams.toString();
  }
};

export type Props = Pick<ProductListingPage, "sortOptions">;

// TODO: move this to the loader
const portugueseMappings = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  // "release:desc": "Relevância - Decrescente",
  "discount:desc": "Maior desconto",
};

function Sort({ sortOptions }: Props) {
  const sort = useSort();

  return (
    <div class="flex flex-row h-[38px] rounded relative items-center border border-solid border-gray-200 mobile:w-full mobile:ml-2.5">
      <label for="sort" class="sr-only">Ordenar por</label>
      <Icon id="Sort" class="relative left-2" width={20} height={20} />
      <select
        id="sort"
        name="sort"
        onInput={applySort}
        class="w-full h-[38px] px-2 rounded  text-base-content cursor-pointer outline-none bg-transparent "
      >
        {sortOptions.map(({ value, label }) => ({
          value,
          label: portugueseMappings[label as keyof typeof portugueseMappings] ??
            label,
        })).filter(({ label }) => label).map(({ value, label }) => (
          <option key={value} value={value} selected={value === sort}>
            <span class="text-sm pl-2">{label}</span>
          </option>
        ))}
      </select>
    </div>
  );
}

export default Sort;
