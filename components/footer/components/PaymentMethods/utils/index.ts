import { SizeIcons } from "../types.ts";

export const getSizeIcons = (
  paymentMethod: string,
): { width: number; height: number } => {
  const sizeIcons = {
    Elo: { width: 61, height: 32 },
    Pix: { width: 105, height: 40 },
    Amex: { width: 50, height: 50 },
    Boleto: { width: 48, height: 48 },
  } as SizeIcons;

  return sizeIcons[paymentMethod] ?? { width: 39, height: 50 };
};
