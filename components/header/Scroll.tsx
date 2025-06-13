import { useScript } from "@deco/deco/hooks";
import type { ComponentChildren } from "preact";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  children: ComponentChildren;
  showOnScrollUp?: boolean;
}

function Scroll({ children, showOnScrollUp = true }: Props) {
  const id = useId();

  // Classes base
  const baseClass =
    "fixed top-0 left-0 right-0 bg-black-gradient text-white transition-transform duration-300";
  const hiddenClass = "translate-y-0 opacity-100 pointer-events-auto";
  const visibleClass = "translate-y-0 opacity-100 pointer-events-auto";

  return (
    <>
      <div id={id} className={`${baseClass} ${visibleClass} z-20`}>
        {children}
      </div>
      <script
        defer
        dangerouslySetInnerHTML={{
          __html: useScript(
            ({ id, showOnScrollUp, hiddenClass, visibleClass }) => {
              const el = document.getElementById(id) as HTMLElement;
              if (!el) return;

              let lastScrollY = globalThis.window.scrollY;
              const visibleClassList = visibleClass.split(/ +/);
              const hiddenClassList = hiddenClass.split(/ +/);

              function handleScroll() {
                const currentScrollY = globalThis.window.scrollY;
                const visible = currentScrollY <= 150 ||
                  (showOnScrollUp
                    ? currentScrollY < lastScrollY
                    : currentScrollY > lastScrollY);
                if (el.getAttribute("data-visible") !== visible.toString()) {
                  el.setAttribute("data-visible", visible.toString());
                  el.classList.remove(...visibleClassList, ...hiddenClassList);
                  el.classList.add(
                    ...(visible ? visibleClassList : hiddenClassList),
                  );
                }
                lastScrollY = currentScrollY;
              }

              globalThis.window.addEventListener("scroll", handleScroll);
            },
            { id, showOnScrollUp, hiddenClass, visibleClass },
          ),
        }}
      />
    </>
  );
}

export default Scroll;
