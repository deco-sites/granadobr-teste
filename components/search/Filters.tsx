import Avatar from "../../components/ui/Avatar.tsx";
import { formatPrice } from "../../sdk/format.ts";
import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Icon from "site/components/ui/Icon.tsx";
import { sendEvent } from "site/sdk/analytics.tsx";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a
      href={url}
      rel="nofollow"
      class="flex items-center gap-2"
      onClick={() => {
        sendEvent(
          {
            name: "button_click",
            params: {
              click_category: "category",
              click_text: "clique-filtrar-categoria",
              click_description: label,
            },
          },
        );
      }}
    >
      {/* <div aria-checked={selected} class="checkbox" /> */}
      {selected && (
        <Icon id="XMark" size={12} class="text-[#757575]" strokeWidth={1} />
      )}
      <span class={`text-sm ${selected ? "font-bold" : ""}`}>{label}</span>
      {quantity > 0 && <span class="text-sm ">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const flexDirection = key === "tamanho" || key === "cor"
    ? "flex-row"
    : "flex-col";

  return (
    <ul class={`flex flex-wrap gap-2 font-light ${flexDirection}`}>
      {values.map((item, index) => {
        const { url, selected, value } = item;
        /*
        const newUrl = new URL(url);

        if (selected) {
          newUrl.searchParams.delete(key);
        } */

        if (key === "cor" || key === "tamanho") {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return range && (
            <ValueItem
              {...item}
              label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
            />
          );
        }

        return <ValueItem key={index} {...item} url={url} />;
      })}
    </ul>
  );
}

function Filters({ filters }: Props) {
  return (
    <ul class="flex flex-col">
      {filters
        .filter(isToggle)
        .map((filter) => <AccordionItem key={filter.key} filter={filter} />)}
    </ul>
  );
}

function AccordionItem({ filter }: { filter: FilterToggle }) {
  return <FilterValues {...filter} />;
}

export default Filters;
