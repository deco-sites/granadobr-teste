import { RequiredKeys } from "../../../../@types/types.ts";
import { CouponActions } from "../../types.ts";

export interface Props extends
  RequiredKeys<
    CouponActions,
    "onManageCoupon"
  > {
  coupon?: string;
  placeholder: string;
  type: "discount" | "seller";
  title: string;
}
