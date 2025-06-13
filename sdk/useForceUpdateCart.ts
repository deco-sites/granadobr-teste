import { signal } from "@preact/signals";
import { getCookie, setCookie } from "../utils/cache-client/cookie.ts";

const quantity = signal<number>(0);
const allowUpdate = signal<boolean>(true);

export const useForceUpdateCart = () => {
  const reloadQuantity = () => {
    const summaryCount = getCookie("summary_count");
    quantity.value = summaryCount ? parseInt(summaryCount) : 0;
  };

  const updateQuantity = (value?: number) => {
    const summaryCount = getCookie("summary_count") || "0";

    const newSummaryCount = value !== undefined
      ? value
      : parseInt(summaryCount) + 1;

    setCookie("summary_count", newSummaryCount);
    quantity.value = newSummaryCount;
  };

  return {
    allowUpdate,
    updateQuantity,
    reloadQuantity,
    quantity,
  };
};
