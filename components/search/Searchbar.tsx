/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import Button from "../../components/ui/Button.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { sendEvent } from "../../sdk/analytics.tsx";
import { useId } from "../../sdk/useId.ts";
import { useSuggestions } from "../../sdk/useSuggestions.ts";
import { useUI } from "../../sdk/useUI.ts";
import { Suggestion } from "apps/commerce/types.ts";
import type { Platform } from "../../apps/site.ts";
import { Logo } from "site/components/header/Header.tsx";
import Image from "apps/website/components/Image.tsx";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { Layout as cardLayout } from "../../components/product/ProductCard.tsx";
import SearchResponse from "site/components/search/SearchResponse.tsx";
import { debounce } from "std/async/debounce.ts";
import { type Resolved } from "@deco/deco";
import { useSignal } from "@preact/signals";
// Editable props
export interface Props {
  logo?: Logo;
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Page path
   * @description When user clicks on the search button, navigate it to
   * @default /s
   */
  action?: string;
  /**
   * @title Term name
   * @description Querystring param used when navigating the user
   * @default q
   */
  name?: string;
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
  cardLayout?: cardLayout;
  platform?: Platform;
  dontUpdateCartAfter: {
    addItem: boolean;
  };
}
function Searchbar(
  {
    placeholder = "What are you looking for?",
    action = "/s",
    name = "q",
    loader,
    platform,
    logo,
    cardLayout,
    dontUpdateCartAfter,
  }: Props,
) {
  const id = useId();
  const { displayMegaMenuResponsivo, displaySearchPopup } = useUI();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setQuery, payload } = useSuggestions(loader);
  const { products = [], searches = [] } = payload.value ?? {};
  const hasProducts = Boolean(products.length);
  const hasTerms = Boolean(searches.length);

  useEffect(() => {
    if (displaySearchPopup.value === true) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return;
    }
    clearInput();
  }, [displaySearchPopup.value]);
  const searchValue = useSignal("");
  const openSearch = useSignal(false);
  const debouncedSetQuery = debounce((e) => {
    setQuery(e);
    sendEvent({
      name: "search",
      params: { search_term: e },
    });
  }, 300);

  const clearInput = useCallback(() => {
    searchValue.value = "";
    setQuery("");
    openSearch.value = false;
    searchInputRef.current?.focus();
  }, [setQuery]);
  return (
    <div
      class={`w-full grid grid-rows-[50px_1fr] lg:grid-rows-[70px_1fr] p-4 lg:px-8 2xl:py-6 3xl:px-16 
      overflow-y-hidden text-black font-matria font-normal `}
    >
      <form
        id={id}
        action={action}
        class="join flex-row justify-between items-center lg:px-[32px] w-full"
      >
        <div className={`flex flex-row justify-start items-center w-full`}>
          <div className={`mr-[48px] hidden lg:block`}>
            {logo && (
              <a
                href="/"
                aria-label="Store logo"
                className="flex items-center justify-center max-w-[137.14px] 2xl:max-w-[160px] max-h-[60px] 2xl:max-h-[70px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 160}
                  height={logo.height || 70}
                  loading="lazy"
                  fetchPriority="low"
                />
              </a>
            )}
          </div>

          {/** Input */}
          <div
            className={`relative flex flex-wrap  items-center bg-[#F6F3F8] rounded-[5px] border-none w-full lg:w-[398px] h-[46px]`}
          >
            <input
              ref={searchInputRef}
              type="search"
              className="flex-grow order-2 lg:order-1 border-none mr-2 rounded-md py-3 pl-4 bg-[#F6F3F8] outline-none text-[15px]"
              id="search-input"
              name={name}
              value={searchValue}
              onInput={(e) => {
                const value = e.currentTarget.value;
                debouncedSetQuery(value);
                searchValue.value = e.currentTarget.value;
              }}
              onClick={() => {
                openSearch.value = true;
              }}
              placeholder={placeholder}
              role="combobox"
              aria-controls="search-suggestion"
              aria-haspopup="listbox"
              aria-expanded={displaySearchPopup.value}
              autoComplete="off"
            />

            <div
              className={`text-[#333333] text-[12px] order-3 lg:order-2 ${
                !searchValue.value ? "hidden" : ""
              }`}
            >
              <button
                onClick={clearInput}
                type="button"
                aria-label="Clear search"
              >
                Limpar
              </button>
            </div>

            <div
              className={`w-[50px] lg:inline-flex justify-center text-green-800 order-1 lg:order-3 
              transform transition-transform duration-500 ${
                displaySearchPopup.value
                  ? "translate-x-0 ml-1 lg:translate-x-0"
                  : "translate-x-[100vh] lg:translate-x-0"
              }`}
            >
              <button type="submit" aria-label="Search" tabIndex={-1}>
                <Icon id="MagnifyingGlass" size={28} strokeWidth={0.01} />
              </button>
            </div>

            <div
              className={`lg:hidden order-4 w-[50px] justify-center inline-flex`}
            >
              {(openSearch || !displayMegaMenuResponsivo.value) && (
                <button
                  type="button"
                  onClick={() => {
                    clearInput();
                    displayMegaMenuResponsivo.value = !displayMegaMenuResponsivo.value;
                    displaySearchPopup.value = !displaySearchPopup.value;
                  }}
                  aria-label="search closed"
                >
                  <Icon id="XMark" size={20} strokeWidth={0.01} />
                </button>
              )}
              {!openSearch && displayMegaMenuResponsivo.value && (
                <button
                  type="button"
                  onClick={() => {
                    displayMegaMenuResponsivo.value = !displayMegaMenuResponsivo
                      .value;
                    displaySearchPopup.value = false;
                  }}
                  aria-label="search closed"
                >
                  <Icon id="XMark" size={20} strokeWidth={0.01} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/** close */}
        <Button
          type="button"
          class="join-item btn-ghost btn-square hidden lg:inline-flex"
          onClick={() => (displaySearchPopup.value = false)}
          ariaLabel={displaySearchPopup.value ? "close search" : "open search"}
          id="close-search"
        >
          <Icon id="XMark" size={20} strokeWidth={0.01} />
        </Button>
      </form>

      <div
        className={`flex md:hidden ${
          !searchValue.value &&
            (openSearch.value || !displayMegaMenuResponsivo.value)
            ? "block p-5 h-screen"
            : "hidden"
        }`}
      >
        <div>
          <span class="text-2xl text-green-800 font-matria">
            Buscas Populares
          </span>
          <ul>
            {searches.map((search) => (
              <li class="py-2 text-gray-800">
                <a href={search.href}>{search.term}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {searchValue.value && (
        <div
          className={`overflow-y-scroll overflow-x-hidden ${
            !hasProducts && !hasTerms ? "hidden" : "block"
          } ${!hasProducts && !hasTerms ? "min-h-0" : "min-h-[200px]"}`}
        >
          <SearchResponse
            searches={searches}
            products={products}
            dontUpdateCartAfter={dontUpdateCartAfter}
            hasProducts={hasProducts}
            hasTerms={hasTerms}
            platform={platform}
            cardLayout={cardLayout}
          />
        </div>
      )}
    </div>
  );
}
export default Searchbar;
