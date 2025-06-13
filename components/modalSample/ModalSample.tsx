import { useSignal } from "@preact/signals";

import Modal from "../ui/Modal.tsx";
import ModalContent from "./components/ModalContent/index.tsx";

import { useModalSample } from "../../sdk/useModalSample.ts";

const ModalSample = () => {
  const { modal, removeModal } = useModalSample();

  if (!modal.value) return null;
  const isLoading = useSignal(false);

  const {
    title,
    onConfirm,
    onCancelLabel,
    onConfirmLabel,
    description,
    onCancel,
    content,
  } = modal.value;

  const onSubmit = async () => {
    isLoading.value = true;
    await onConfirm();

    isLoading.value = false;

    onCancel && onCancel();
    removeModal();
  };

  const onRefuse = () => {
    if (isLoading.value) {
      return;
    }

    onCancel && onCancel();
    removeModal();
  };

  return (
    <Modal
      open
      onClose={onRefuse}
    >
      <ModalContent
        title={title}
        onRefuse={onRefuse}
        isLoading={isLoading.value}
        onConfirm={onSubmit}
        onConfirmLabel={onConfirmLabel}
        onCancelLabel={onCancelLabel}
        description={description}
        content={content}
      />
    </Modal>
  );
};

export default ModalSample;
