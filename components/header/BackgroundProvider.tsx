import { useScript } from "@deco/deco/hooks";
import type { ComponentChildren } from "preact";
import { useId } from "../../sdk/useId.ts";
import { clx } from "../../sdk/clx.ts";

interface BackgroundProviderProps {
  children: ComponentChildren;
  device: "mobile" | "desktop" | "tablet";
  isHomePage: boolean;
}

function BackgroundProvider({
  children,
  device,
  isHomePage,
}: BackgroundProviderProps) {
  const id = useId();
  const mobileClasses =
    "group/bg-provider bg-transparent text-white flex flex-wrap justify-between items-center w-full p-4 lg:px-8 2xl:py-6 3xl:px-16 transition-colors duration-300";
  const desktopClasses = clx(
    "group/bg-provider flex-wrap justify-between items-center w-full p-4 lg:px-8 2xl:py-6 3xl:px-16 transition-colors duration-300",
    "data-[background=white]:bg-white data-[background=white]:text-black",
    "data-[background=white]:hidden data-[background=white]:md:flex",
    "data-[background=transparent]:bg-transparent data-[background=transparent]:text-white",
    "data-[background=transparent]:flex",
  );
  const isMobile = device !== "desktop";

  return (
    <>
      <div
        id={id}
        class={isMobile ? mobileClasses : desktopClasses}
        data-background={isHomePage || device === "mobile"
          ? "transparent"
          : "white"}
      >
        {children}
      </div>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: useScript(
            ({ id, device, isHomePage }) => {
              const el = document.getElementById(id) as HTMLElement;
              if (!el) return;
              let isMouseOver = false;

              function isDropdownOpen() {
                const dropdownOpen = document.querySelector(
                  "[data-dropdown-open=true]",
                );
                return !!dropdownOpen;
              }

              function updateMobile() {
                if (!isHomePage) {
                  el.style.display = "none";
                  return;
                }
                if (globalThis.window.scrollY <= 150) {
                  el.style.display = "";
                } else {
                  el.style.display = "none";
                }
              }

              function updateDesktop() {
                const setWhite = () => {
                  if (el.getAttribute("data-background") !== "white") {
                    el.setAttribute("data-background", "white");
                  }
                };

                const setTransparent = () => {
                  if (el.getAttribute("data-background") !== "transparent") {
                    el.setAttribute("data-background", "transparent");
                  }
                };

                const setHidden = () => {
                  if (!el.classList.contains("hidden")) {
                    el.classList.add("hidden", "md:flex");
                  }
                };

                const setVisible = () => {
                  if (el.classList.contains("hidden")) {
                    el.classList.remove("hidden");
                  }
                };

                if (!isHomePage) {
                  setHidden();
                  return setWhite();
                }

                if (
                  isMouseOver || globalThis.window.scrollY > 150 ||
                  isDropdownOpen()
                ) {
                  setWhite();
                } else {
                  setTransparent();
                }

                if (globalThis.window.scrollY <= 150) {
                  setVisible();
                } else {
                  setHidden();
                }
              }
              if (device === "mobile") {
                updateMobile();
                globalThis.window.addEventListener("scroll", updateMobile);
              } else {
                updateDesktop();
                globalThis.window.addEventListener("scroll", updateDesktop);
                el.addEventListener("mouseenter", function () {
                  if (isHomePage) {
                    isMouseOver = true;
                    updateDesktop();
                  }
                });
                el.addEventListener("mouseleave", function () {
                  if (
                    isHomePage && globalThis.window.scrollY <= 150 &&
                    !isDropdownOpen()
                  ) {
                    isMouseOver = false;
                    updateDesktop();
                  }
                });
              }
            },
            { id, device, isHomePage },
          ),
        }}
      />
    </>
  );
}

export default BackgroundProvider;
