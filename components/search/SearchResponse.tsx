import Slider from "site/components/ui/Slider.tsx";
import ProductCard, {
  Layout as cardLayout,
} from "site/components/product/ProductCard.tsx";
import type { Platform } from "../../apps/site.ts";
import type { Product } from "apps/commerce/types.ts";

export interface SearchResponseProps {
  searches: { term: string; href: string }[];
  products: Product[];
  hasProducts: boolean;
  hasTerms: boolean;
  platform?: Platform;
  cardLayout?: cardLayout;
  dontUpdateCartAfter: {
    addItem: boolean;
  };
}

const SearchResponse: React.FC<SearchResponseProps> = ({
  searches,
  products,
  hasProducts,
  dontUpdateCartAfter,
  hasTerms,
  platform,
  cardLayout,
}) => {
  const hasSearches = searches.length > 0;
  return (
    <div
      className={`h-screen gap-4 grid grid-cols-1 sm:grid-rows-1 p-5 lg:p-8 ${
        hasSearches ? "lg:grid-cols-[16%_1fr]" : ""
      } overflow-y-auto`}
    >
      {hasSearches && (
        <div className="hidden lg:flex lg:flex-col gap-6">
          <div className="flex flex-col">
            <span
              className="font-normal text-[12px] text-[#1D1D1D] p-1"
              role="heading"
              aria-level={3}
            >
              CATEGORIAS
            </span>
            <ul id="search-suggestion" className="flex flex-col">
              {searches.map(({ term, href }) => (
                <li className="hover:bg-[#F6F3F8]">
                  <a
                    href={href}
                    className="flex gap-4 items-center px-2.5 my-[5px]"
                  >
                    <span
                      className="font-normal text-[16px]"
                      dangerouslySetInnerHTML={{ __html: term }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <span
              className="font-normal text-[12px] text-[#1D1D1D] p-1"
              role="heading"
              aria-level={3}
            >
              PÁGINAS
            </span>
            <ul id="search-suggestion" className="flex flex-col">
              {searches.map(({ term, href }) => (
                <li className="hover:bg-[#F6F3F8]">
                  <a
                    href={href}
                    className="flex gap-4 items-center px-2.5 my-[5px]"
                  >
                    <span
                      className="font-normal text-[16px]"
                      dangerouslySetInnerHTML={{ __html: term }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col pt-6 md:pt-0 gap-6 overflow-y-auto">
        {hasProducts && hasTerms && (
          <div className="flex justify-between items-center text-[15px] text-[#1D1D1D]">
            <span className="text-green-800 ml-4" role="heading" aria-level={3}>
              Produtos sugeridos ({products.length})
            </span>
          </div>
        )}

        <Slider className="carousel grid grid-cols-2 md:grid-cols-5 gap-2 lg:gap-x-4 overflow-y-auto">
          {products.map((product, index) => (
            <Slider.Item
              index={index}
              className="carousel-item flex-shrink-0 w-full rounded-lg border"
            >
              <ProductCard
                product={product}
                platform={platform}
                index={index}
                dontUpdateCartAfter={dontUpdateCartAfter}
                layout={cardLayout}
                itemListName="Suggeestions"
              />
            </Slider.Item>
          ))}
        </Slider>
        {hasProducts && hasTerms && (
          <div className="flex justify-center items-center text-[15px] text-[#1D1D1D]">
            <span>
              Veja os produtos em{" "}
              <a
                href={`/granado/catalogsearch/result/?q=${searches[0].term}`}
                className="font-extrabold"
              >
                Todos os departamentos
              </a>{" "}
              ({products.length}) ou em{" "}
              <a
                href={`/granado/catalogsearch/result/?q=${searches[0].term}`}
                className="font-extrabold"
              >
                {searches[0].term}
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResponse;
