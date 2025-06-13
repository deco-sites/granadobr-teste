interface PaymentItem {
  label: "Amex" | "Elo" | "Diners" | "Mastercard" | "Visa" | "Boleto" | "Pix";
}

export interface Payment {
  title?: string;
  items: PaymentItem[];
}

export interface SizeIcons {
  [key: string]: { width: number; height: number };
}

export interface Props {
  content?: Payment;
}
