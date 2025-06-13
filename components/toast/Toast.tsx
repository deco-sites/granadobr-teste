import ToastItem from "./components/ToastItem/index.tsx";
import Show from "../../directives/Show/index.tsx";

import { useToast } from "../../sdk/useToast.ts";

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Show when={toasts.value.length > 0}>
      <div class="flex flex-col gap-2 fixed top-4 md:top-6 right-4 md:right-6 z-[1000]">
        {toasts.value.map((toast) => (
          <ToastItem
            key={toast.id}
            title={toast.title}
            autoClose={toast.autoClose}
            autoCloseDuration={toast.autoCloseDuration}
            onClose={() => removeToast(toast.id)}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </div>
    </Show>
  );
};

export default Toast;
