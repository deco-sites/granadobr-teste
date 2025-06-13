import { useEffect, useRef } from "preact/hooks";
import { clx } from "../../../../sdk/clx.ts";

import Icon from "../../../ui/Icon.tsx";
import Button from "../../../ui/Button.tsx";

import { preventXSS } from "../../../../sdk/format.ts";
import { Props } from "./types.ts";

const typeClass = {
  error: "bg-[#FAE5E5] border-red-600",
  success: "bg-[#F5FBF5] border-green-600",
  warning: "bg-[#FFF2E9] border-orange-400",
} as const;

const Toast = ({
  type,
  message,
  autoCloseDuration,
  autoClose,
  onClose,
  title,
}: Props) => {
  const toastEl = useRef<HTMLDivElement>(null);

  const onAnimationEnd = (event: AnimationEvent) => {
    if (event.animationName === "outRight") {
      onClose();
    }
  };

  const onRemoveToast = () => {
    if (!toastEl.current) return;

    toastEl.current.classList.remove("animate-inRight");
    toastEl.current.classList.add("animate-outRight");

    toastEl.current.addEventListener("animationend", onAnimationEnd);
  };

  useEffect(() => {
    if (!autoClose || !toastEl.current) return;

    const timeoutId = setTimeout(
      () => onRemoveToast(),
      autoCloseDuration * 1000,
    );

    return () => {
      clearTimeout(timeoutId);
      toastEl.current?.removeEventListener("animationend", onAnimationEnd);
    };
  }, []);

  return (
    <div
      ref={toastEl}
      class={clx(
        "flex flex-col gap-2 py-4 px-6 rounded border w-[260px] animate-inRight",
        typeClass[type] ?? "",
      )}
      role="alert"
    >
      <div class="flex justify-between w-full text-gray-950">
        <strong class="text-sm font-bold leading-[18px] font-matria">
          {title}
        </strong>

        <Button
          aria-label="Fechar popup de feedback"
          class="btn-ghost hover:bg-transparent min-h-4 h-4 max-w-4 p-0"
          onClick={() => toastEl.current && onRemoveToast()}
        >
          <Icon id="XMark" size={16} strokeWidth={0} />
        </Button>
      </div>

      <span
        class="text-sm font-normal font-matria"
        dangerouslySetInnerHTML={{
          __html: preventXSS(message),
        }}
      />
    </div>
  );
};

export default Toast;
