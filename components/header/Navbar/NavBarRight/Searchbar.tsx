import { useSignal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Searchbar, {
  Props as SearchbarProps,
} from "site/components/search/Searchbar.tsx";
import { useUI } from "site/sdk/useUI.ts";

export interface Props {
  searchbar?: SearchbarProps;
  children?: ComponentChildren;
  device: "mobile" | "desktop" | "tablet";
  dontUpdateCartAfter: {
    addItem: boolean;
  };
  hasTopBar?: boolean;
}

function SearchbarModal(
  { searchbar, children, device, dontUpdateCartAfter, hasTopBar }: Props,
) {
  const { displayMegaMenuResponsivo, displaySearchPopup } = useUI();
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displaySearchPopup.value) {
      if (focusRef.current) {
        focusRef.current.focus();
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [displaySearchPopup.value]);

  const modalClasses = `transition-transform duration-300 ease-in-out ${
    displaySearchPopup.value
      ? "translate-x-0 md:translate-x-0 lg:translate-y-0 opacity-100 pointer-events-auto"
      : "-translate-x-full md:translate-x-0 lg:translate-y-full opacity-0 pointer-events-none"
  } ${hasTopBar ? "lg:mt-[35px]" : ""}`;

  const mobileModalClasses = `transition-transform duration-300 ease-in-out ${
    displaySearchPopup.value
      ? "translate-x-0 opacity-100 pointer-events-auto"
      : "-translate-x-full opacity-0 pointer-events-none"
  }`;

  return (
    <>
      <style>
        {`
          input[type="search"]::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
          }
        `}
      </style>
      {device === "desktop" && (
        <>
          <div
            className={`fixed top-0 left-0 z-50 md:fixed md:top-[135px] lg:absolute lg:top-0 w-full flex justify-center items-center ${modalClasses} isolate`}
          >
            <div
              ref={focusRef}
              tabIndex={0}
              className={`bg-white shadow-xl w-full md:h-auto overflow-auto ${
                displayMegaMenuResponsivo.value ? "h-auto" : "h-screen"
              } md:max-h-[calc(100vw*0.75)]`}
              onClick={(e) => e.stopPropagation()}
            >
              {searchbar && (
                <Searchbar {...{ ...searchbar, dontUpdateCartAfter }} />
              )}
            </div>
          </div>

          {globalThis.innerWidth < 768 && (
            <div
              className={`fixed top-[80px] z-30 left-0 w-full bg-white transition duration-300 ease-in-out ${
                displaySearchPopup.value
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "-translate-x-full opacity-0 pointer-events-none"
              }`}
            >
              {children}
            </div>
          )}
        </>
      )}

      {device === "mobile" && (
        <>
          <div
            class={`fixed top-0 left-0 z-50 w-full flex justify-center items-center transition-transform duration-300 ease-in-out ${mobileModalClasses} isolate`}
          >
            <div
              ref={focusRef}
              tabIndex={0}
              className="bg-white shadow-xl w-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {searchbar && (
                <Searchbar {...{ ...searchbar, dontUpdateCartAfter }} />
              )}
            </div>
          </div>

          <div
            className={`fixed top-[80px] z-30 left-0 w-full bg-white transition duration-300 ease-in-out ${
              displaySearchPopup.value
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "-translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            {children}
          </div>
        </>
      )}

      {device === "tablet" && (
        <div
          className={`fixed top-0 left-0 z-50 w-full flex justify-center items-center ${modalClasses} isolate`}
        >
          <div
            ref={focusRef}
            tabIndex={0}
            className={`bg-white shadow-xl w-full overflow-auto ${
              displayMegaMenuResponsivo.value ? "h-auto" : "h-screen"
            } md:max-h-[calc(100vw*0.75)]`}
            onClick={(e) => e.stopPropagation()}
          >
            {searchbar && (
              <Searchbar {...{ ...searchbar, dontUpdateCartAfter }} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SearchbarModal;
