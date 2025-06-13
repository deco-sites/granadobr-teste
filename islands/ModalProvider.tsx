import { useContext, useMemo, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

export interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (value: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const value = useMemo(
    () => ({
      isModalOpen,
      setIsModalOpen,
      currentIndex,
      setCurrentIndex,
      quantity,
      setQuantity,
      isShareModalOpen,
      setIsShareModalOpen,
    }),
    [isModalOpen, currentIndex, quantity, isShareModalOpen],
  );

  return <ModalContext.Provider value={value}>{children}
  </ModalContext.Provider>;
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
