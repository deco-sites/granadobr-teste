import { useEffect } from "preact/hooks";

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  hasInsideSlider?: boolean;
}

const ATTRIBUTES = {
  "data-slider": "data-slider",
  "data-slider-item": "data-slider-item",
  'data-slide="prev"': 'data-slide="prev"',
  'data-slide="next"': 'data-slide="next"',
  "data-dot": "data-dot",
};

// Percentage of the item that has to be inside the container
// for it it be considered as inside the container
const THRESHOLD = 0.6;

const intersectionX = (element: DOMRect, container: DOMRect): number => {
  const delta = container.width / 1_000;

  if (element.right < container.left - delta) {
    return 0.0;
  }

  if (element.left > container.right + delta) {
    return 0.0;
  }

  if (element.left < container.left - delta) {
    return element.right - container.left + delta;
  }

  if (element.right > container.right + delta) {
    return container.right - element.left + delta;
  }

  return element.width;
};

// as any are ok in typeguard functions
const isHTMLElement = (x: Element): x is HTMLElement =>
  // deno-lint-ignore no-explicit-any
  typeof (x as any).offsetLeft === "number";

const setup = (
  { rootId, scroll, interval, infinite, hasInsideSlider }: Props,
) => {
  const root = document.getElementById(rootId);
  const strictSelector = hasInsideSlider ? `[data-slider-id=${rootId}]` : "";
  const slider = root?.querySelector<HTMLDivElement>(
    `[${ATTRIBUTES["data-slider"]}]`,
  );
  const items = root?.querySelectorAll(
    `${strictSelector}[${ATTRIBUTES["data-slider-item"]}]`,
  );
  const prev = root?.querySelector(
    `${strictSelector}[${ATTRIBUTES['data-slide="prev"']}]`,
  );
  const next = root?.querySelector(
    `${strictSelector}[${ATTRIBUTES['data-slide="next"']}]`,
  );
  const dots = root?.querySelectorAll(
    `${strictSelector}[${ATTRIBUTES["data-dot"]}]`,
  );

  if (!root || !slider || !items || items.length === 0) {
    console.warn(
      "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
      { root, slider, items, rootId },
    );

    return;
  }

  const getElementsInsideContainer = () => {
    const indices: number[] = [];
    const sliderRect = slider.getBoundingClientRect();

    for (let index = 0; index < items.length; index++) {
      const item = items.item(index);
      const rect = item.getBoundingClientRect();

      const ratio = intersectionX(
        rect,
        sliderRect,
      ) / rect.width;

      if (ratio > THRESHOLD) {
        indices.push(index);
      }
    }

    return indices;
  };

  const goToItem = (index: number) => {
    const item = items.item(index);

    if (!isHTMLElement(item)) {
      console.warn(
        `Element at index ${index} is not an html element. Skipping carousel`,
      );

      return;
    }

    slider.scrollTo({
      top: 0,
      behavior: scroll,
      left: item.offsetLeft - slider.offsetLeft,
    });
  };

  const onClickPrev = () => {
    const indices = getElementsInsideContainer();
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingFirst = indices[0] === 0;
    const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);

    goToItem(
      isShowingFirst ? items.length - 1 : (pageIndex - 1) * itemsPerPage,
    );
  };

  const onClickNext = () => {
    const indices = getElementsInsideContainer();
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingLast = indices[indices.length - 1] === items.length - 1;
    const pageIndex = Math.floor(indices[0] / itemsPerPage);

    goToItem(isShowingLast ? 0 : (pageIndex + 1) * itemsPerPage);
  };

  const observer = new IntersectionObserver(
    (elements) =>
      elements.forEach((item) => {
        const index = Number(item.target.getAttribute("data-slider-item")) || 0;
        const dot = dots?.item(index);

        if (item.isIntersecting) {
          dot?.setAttribute("disabled", "");
        } else {
          dot?.removeAttribute("disabled");
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
      }),
    { threshold: THRESHOLD, root: slider },
  );

  items.forEach((item) => observer.observe(item));

  for (let it = 0; it < (dots?.length ?? 0); it++) {
    dots?.item(it).addEventListener("click", () => goToItem(it));
  }

  prev?.addEventListener("click", onClickPrev);
  next?.addEventListener("click", onClickNext);

  const timeout = interval && setInterval(onClickNext, interval);

  // Add drag state variables
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    slider.style.cursor = "grabbing";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    // Prevent default drag behavior
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    isDragging = false;
    slider.style.cursor = "grab";
  };

  // Add mouse event listeners
  slider.style.cursor = "grab";
  slider.addEventListener("mousedown", onMouseDown);
  globalThis.window.addEventListener("mousemove", onMouseMove);
  globalThis.window.addEventListener("mouseup", onMouseUp);
  slider.addEventListener("mouseleave", onMouseUp);

  // Unregister callbacks
  return () => {
    for (let it = 0; it < (dots?.length ?? 0); it++) {
      dots?.item(it).removeEventListener("click", () => goToItem(it));
    }

    prev?.removeEventListener("click", onClickPrev);
    next?.removeEventListener("click", onClickNext);

    observer.disconnect();

    clearInterval(timeout);

    slider.removeEventListener("mousedown", onMouseDown);
    globalThis.window.removeEventListener("mousemove", onMouseMove);
    globalThis.window.removeEventListener("mouseup", onMouseUp);
    slider.removeEventListener("mouseleave", onMouseUp);
  };
};

function Slider({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  hasInsideSlider = false,
}: Props) {
  useEffect(
    () => setup({ rootId, scroll, interval, infinite, hasInsideSlider }),
    [
      rootId,
      scroll,
      interval,
      infinite,
    ],
  );

  return <div data-slider-controller-js />;
}

export default Slider;
