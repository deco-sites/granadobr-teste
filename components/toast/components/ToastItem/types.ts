export interface Props {
  title: string;
  onClose: () => void;
  autoCloseDuration: number;
  type: "success" | "warning" | "error";
  autoClose: boolean;
  message: string;
}
