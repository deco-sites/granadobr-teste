import { AnalyticsItem } from "apps/commerce/types.ts";

export interface Props {
  total: number;
  loading: boolean;
  currency: string;
  quantity?: number;
  forceUpdateCart?: () => void;
  items: AnalyticsItem[];
}
