import { state } from "../../../sdk/hooks/context.ts";
import { UPDATE_ALL_STATES, UPDATE_GIFT, UPDATE_GW } from "../utils.ts";

import { OnManageCoupon } from "../types.ts";

interface ActionCoupon {
  couponCode: string;
}

interface ActionSeller {
  sellerCode: string;
}

interface UseCouponProps {
  coupon: string;
  addSeller: ({ sellerCode }: ActionSeller) => Promise<void>;
  removeSeller: ({ sellerCode }: ActionSeller) => Promise<void>;
  addCoupon: ({ couponCode }: ActionCoupon) => Promise<void>;
  removeCoupon: (arg: undefined) => Promise<void>;
  seller: string;
}

export const useCoupon = (
  { coupon, seller, addCoupon, removeCoupon, addSeller, removeSeller }:
    UseCouponProps,
) => {
  const { reloadItems } = state;

  const onManageSeller = async ({ couponCode }: OnManageCoupon) => {
    seller.length
      ? await removeSeller({ sellerCode: couponCode })
      : await addSeller({ sellerCode: couponCode });

    reloadItems.value = UPDATE_ALL_STATES;
  };

  const onManageDiscount = async ({ couponCode }: OnManageCoupon) => {
    coupon.length
      ? await removeCoupon(undefined)
      : await addCoupon({ couponCode, dangerouslyOverrideReturnNull: false });

    reloadItems.value = { ...UPDATE_GIFT, ...UPDATE_GW };
  };

  return {
    onManageSeller,
    onManageDiscount,
  };
};
