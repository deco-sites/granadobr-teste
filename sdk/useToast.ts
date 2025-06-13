import { signal } from "@preact/signals";

interface Toast {
  id: number;
  title: string;
  type: "success" | "warning" | "error";
  autoCloseDuration: number;
  autoClose: boolean;
  message: string;
}

interface ShowToast
  extends Omit<Toast, "id" | "title" | "autoCloseDuration" | "autoClose"> {
  title?: string;
  autoCloseDuration?: number;
  autoClose?: boolean;
}

const toasts = signal<Toast[] | []>([]);

export const useToast = () => {
  const showToast = ({
    title,
    message,
    autoCloseDuration = 3,
    autoClose = true,
    type,
  }: ShowToast) => {
    const toast = {
      type,
      autoClose,
      id: Date.now(),
      title: title || defaultTitle(type),
      autoCloseDuration,
      message,
    };

    toasts.value = [...toasts.value, toast];
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const defaultTitle = (
    type: "error" | "success" | "warning",
  ) => ({ error: "Erro", success: "Sucesso", warning: "Atenção" }[type]);

  return {
    toasts,
    addToast: showToast,
    removeToast,
  };
};
