export interface Props {
  title: string;
  isLoading: boolean;
  onRefuse: () => void;
  content: React.ReactNode;
  onConfirm: () => Promise<void>;
  onConfirmLabel?: string;
  onCancelLabel?: string;
  description: string;
}
