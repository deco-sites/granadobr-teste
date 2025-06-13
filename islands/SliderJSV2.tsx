import { useEffect, useRef } from "preact/hooks";
import { useModal } from "site/islands/ModalProvider.tsx";

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  itemsPerPage?: number;
  initialIndex?: number;
}

const ATTRIBUTES = {
  "data-slider": "data-slider",
  "data-slider-item": "data-slider-item",
  'data-slide="prev"': 'data-slide="prev"',
  'data-slide="next"': 'data-slide="next"',
  "data-dot": "data-dot",
};

const THRESHOLD = 0.5;

const intersectionX = (element: DOMRect, container: DOMRect): number => {
  const delta = container.width / 1_000;
  if (
    element.right < container.left - delta ||
    element.left > container.right + delta
  ) {
    return 0.0;
  } else if (element.left < container.left - delta) {
    return element.right - container.left + delta;
  } else if (element.right > container.right + delta) {
    return container.right - element.left + delta;
  }
  return element.width;
};

const isHTMLElement = (x: Element): x is HTMLElement =>
  typeof (x as HTMLElement).offsetLeft === "number";

function getVisibleIndices(
  items: NodeListOf<Element>,
  slider: Element,
): number[] {
  const indices: number[] = [];
  const sliderRect = slider.getBoundingClientRect();
  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const visiblePortion = intersectionX(itemRect, sliderRect) / itemRect.width;
    if (visiblePortion > THRESHOLD) {
      indices.push(index);
    }
  });
  return indices;
}

// deno-lint-ignore no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  timeout = 50,
): (...args: Parameters<T>) => void => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

function Slider({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  itemsPerPage = 1,
  initialIndex = 0,
}: Props) {
  const { setCurrentIndex } = useModal();
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector(`[${ATTRIBUTES["data-slider"]}]`);
    const items = slider?.querySelectorAll(
      `[${ATTRIBUTES["data-slider-item"]}]`,
    );

    if (!slider || !items || items.length === 0) {
      console.warn(
        "Slider setup failed: Check if the DOM elements are properly defined.",
        { root, slider, items },
      );
      return;
    }

    const targetIndex = initialIndex ?? 0;
    const initialItem = items.item(targetIndex) as HTMLElement;

    if (initialItem && root) {
      slider.scrollLeft = initialItem.offsetLeft - root.offsetLeft;
    }
  }, [rootId, initialIndex]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector(`[${ATTRIBUTES["data-slider"]}]`);
    const items = root?.querySelectorAll(`[${ATTRIBUTES["data-slider-item"]}]`);
    const prev = root?.querySelector(
      `[${ATTRIBUTES['data-slide="prev"']}]`,
    ) as HTMLElement | null;
    const next = root?.querySelector(
      `[${ATTRIBUTES['data-slide="next"']}]`,
    ) as HTMLElement | null;
    const dots = root?.querySelectorAll(`[${ATTRIBUTES["data-dot"]}]`);

    if (!root || !slider || !items || items.length === 0) {
      console.warn(
        "Missing necessary slider attributes. It will not work as intended.",
        { root, slider, items, rootId },
      );
      return;
    }

    const goToPage = (pageIndex: number) => {
      const targetIndex = pageIndex * itemsPerPage;
      if (targetIndex >= items.length) return;
      const item = items.item(targetIndex) as HTMLElement;

      if (!isHTMLElement(item)) {
        console.warn(
          `Element at index ${targetIndex} is not an HTML element. Skipping carousel movement.`,
        );
        return;
      }

      slider.scrollTo({
        top: 0,
        behavior: scroll || "auto",
        left: item.offsetLeft - root.offsetLeft,
      });

      setCurrentIndex(targetIndex);
    };

    const onClickPrev = () => {
      const visibleIndices = getVisibleIndices(items, slider);
      const firstIndex = visibleIndices[0];
      const pageIndex = Math.floor(firstIndex / itemsPerPage);
      const newPageIndex = pageIndex - 1;
      if (newPageIndex < 0) {
        goToPage(infinite ? Math.ceil(items.length / itemsPerPage) - 1 : 0);
      } else {
        goToPage(newPageIndex);
      }
    };

    const onClickNext = () => {
      const visibleIndices = getVisibleIndices(items, slider);
      const lastIndex = visibleIndices[visibleIndices.length - 1];
      const pageIndex = Math.floor(lastIndex / itemsPerPage);
      const newPageIndex = pageIndex + 1;
      if (newPageIndex >= Math.ceil(items.length / itemsPerPage)) {
        goToPage(infinite ? 0 : pageIndex);
      } else {
        goToPage(newPageIndex);
      }
    };

    next?.addEventListener("click", onClickNext);
    prev?.addEventListener("click", onClickPrev);

    dots?.forEach((dot, index) => {
      dot.addEventListener("click", () => goToPage(index));
    });

    const updateDots = debounce((visibleIndexes: number[]) => {
      dots?.forEach((dot, dotIndex) => {
        if (visibleIndexes.includes(dotIndex)) {
          dot.setAttribute("disabled", "");
        } else {
          dot.removeAttribute("disabled");
        }
      });
    });

    const observer = new IntersectionObserver(
      (elements) => {
        const visibleIndexes = new Set<number>();

        elements.forEach((item) => {
          const index = Number(item.target.getAttribute("data-slider-item")) ||
            0;
          if (item.isIntersecting) {
            const pageIndex = Math.floor(index / itemsPerPage);
            visibleIndexes.add(pageIndex);
          }

          if (!infinite) {
            if (index === 0) {
              if (item.isIntersecting) {
                prev?.setAttribute("disabled", "");
              } else {
                prev?.removeAttribute("disabled");
              }
            }
            if (index === items.length - 1) {
              if (item.isIntersecting) {
                next?.setAttribute("disabled", "");
              } else {
                next?.removeAttribute("disabled");
              }
            }
          }
        });

        updateDots(Array.from(visibleIndexes));
      },
      { threshold: THRESHOLD, root: slider },
    );

    items.forEach((item) => observer.observe(item));

    intervalRef.current = interval
      ? globalThis.setInterval(onClickNext, interval)
      : undefined;

    return () => {
      prev?.removeEventListener("click", onClickPrev);
      next?.removeEventListener("click", onClickNext);
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [rootId, scroll, interval, infinite, itemsPerPage, initialIndex]);

  return <div data-slider-controller-js />;
}

export default Slider;
