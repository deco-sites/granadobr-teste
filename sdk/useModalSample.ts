import { signal } from "@preact/signals";

interface Modal {
  title: string;
  onCancel?: () => void;
  onCancelLabel?: string;
  content: React.ReactNode;
  onConfirmLabel?: string;
  onConfirm: () => void;
  description: string;
}

const modal = signal<Modal | null>(null);

export const useModalSample = () => {
  const showModal = (props: Modal) => {
    modal.value = { ...props };
  };

  const removeModal = () => {
    modal.value = null;
  };

  return {
    modal,
    showModal,
    removeModal,
  };
};
