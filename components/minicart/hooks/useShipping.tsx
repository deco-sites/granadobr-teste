import { OnEstimateShipping, OnSetShipping } from "../types.ts";

interface ShippingRate {
  amount: number;
  method_code: string;
  method_title: string;
  carrier_code: string;
  carrier_title: string;
}

interface UseShippingProps {
  setSimulate: ({
    postcode,
    methodCode,
    carrierCode,
  }: OnSetShipping) => Promise<void>;
  simulate: ({
    postcode,
    countryId,
  }: {
    postcode: string;
    countryId: string;
  }) => ShippingRate[];
}

export const useShipping = ({ setSimulate, simulate }: UseShippingProps) => {
  const onSetShipping = async ({
    postcode,
    carrierCode,
    methodCode,
  }: OnSetShipping) => {
    await setSimulate({
      postcode,
      methodCode,
      carrierCode,
    });
  };

  const onEstimateShipping = async ({
    postcode,
    countryId,
  }: OnEstimateShipping) => {
    const rates = await simulate({
      postcode,
      countryId,
    });

    const availableShipping = rates.filter(
      (rate) =>
        rate.carrier_code !== "amstorepickup" &&
        rate.carrier_code !== "flatrate",
    );

    if (availableShipping.length) {
      return rates.filter((rate) => rate.carrier_code !== "flatrate");
    }

    return rates;
  };

  return {
    onSetShipping,
    onEstimateShipping,
  };
};
