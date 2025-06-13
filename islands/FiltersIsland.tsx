import { useEffect, useState } from "preact/hooks";
import Filters from "../components/search/Filters.tsx";
import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
} from "apps/commerce/types.ts";
import Icon from "../components/ui/Icon.tsx"; // Importe o componente Icon

interface Props {
  filters: Filter[];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

// Função para verificar se algum valor do filtro está selecionado
const isSelected = (values: FilterToggleValue[]) => {
  return values.some((value) => value.selected);
};

const excludeFilters = [
  "categoryIds",
  "categories.level1",
  "categories.level2",
  "price.BRL.default",
];

const filterLabels = new Map([
  ["linha", "Linha"],
  ["marca", "Marca"],
  ["volume", "Volume"],
  ["fragrancias", "Fragrância"],
  ["categories.level0", "Categorias"],
]);

const getFilterLabel = (label: string) =>
  transformString(filterLabels.get(label) || label);

const transformString = (str: string) => {
  return str.replace(
    /(^|_)(\w)/g,
    (_match, separator, char) =>
      separator === "_" ? " " + char.toUpperCase() : char.toUpperCase(),
  );
};

function AccordionWrapper({
  filter,
  isOpen,
  onToggle,
}: {
  filter: FilterToggle;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li class="flex flex-col gap-4 border-b border-solid border-gray-200 sm:bg-gray-100">
      <button
        class="flex justify-between text-xl font-matria font-light items-center pl-0 sm:pl-4 sm:px-4 py-2 sm:bg-gray-100 focus:outline-none"
        onClick={onToggle}
      >
        <span>{getFilterLabel(filter.label)}</span>
        <Icon
          id="ChevronDown"
          size={16}
          className={`transform transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div class="px-4 pt-2 pb-4">
          <Filters filters={[filter]} />
        </div>
      )}
    </li>
  );
}

export default function FiltersIsland({ filters }: Props) {
  const newFilters = filters.filter((filter) =>
    !excludeFilters.includes(filter.key)
  );

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  // Efetuar uma verificação inicial para manter os filtros abertos se algum item estiver selecionado
  useEffect(() => {
    const initialOpenFilters = newFilters.reduce((acc, filter) => {
      if (isToggle(filter) && isSelected(filter.values)) {
        acc[filter.key] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setOpenFilters(initialOpenFilters);
  }, [filters]);

  const handleToggle = (filterKey: string) => {
    setOpenFilters((prevOpenFilters) => ({
      ...prevOpenFilters,
      [filterKey]: !prevOpenFilters[filterKey],
    }));
  };

  return (
    <ul class="flex flex-col p-6 sm:mr-8 sm:bg-gray-100 ">
      {newFilters.filter(isToggle).map((filter) => (
        <AccordionWrapper
          key={filter.key}
          filter={filter}
          isOpen={!!openFilters[filter.key]}
          onToggle={() => handleToggle(filter.key)}
        />
      ))}
    </ul>
  );
}
