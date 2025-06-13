import { RequiredKeys } from "../../../../@types/types.ts";
import { ShippingActions } from "../../types.ts";

export interface ShippingRate {
  amount: number;
  method_code: string;
  method_title: string;
  carrier_code: string;
  carrier_title: string;
}

export interface Props extends
  RequiredKeys<
    ShippingActions,
    "onEstimateShipping" | "onSetShipping"
  > {
  placeholder?: string;
  coupon?: string;
}
