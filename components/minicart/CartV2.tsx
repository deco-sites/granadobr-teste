import { useCart } from "site/sdk/hooks/useCart.ts";
import BaseCart from "./components/BaseCartV2/index.tsx";

import { useProduct } from "./hooks/useProduct.ts";
import { useShipping } from "./hooks/useShipping.tsx";

import { useCoupon } from "./hooks/useCoupon.ts";
import { useWrapping } from "./hooks/useWrapping.tsx";

import { useSellerCode } from "../../sdk/hooks/useSellerCode.ts";

import { useGiftItem } from "../../sdk/hooks/useGiftItem.ts";
import { useGiftWrapping } from "../../sdk/hooks/useGiftWrapping.ts";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useUI } from "site/sdk/useUI.ts";

import {
  GiftItem,
  GiftWrappingItem,
  Item,
  OnManageCoupon,
  Totalizers,
} from "./types.ts";
import { sendEvent } from "site/sdk/analytics.tsx";

export interface Props {
  freeShippingTarget?: number;
}

const Cart = ({ freeShippingTarget }: Props) => {
  const {
    cart,
    loading,
    updateItem,
    setSimulate,
    removeCoupon,
    removeItem,
    addCoupon,
    simulate,
    addItem,
  } = useCart();

  const { displayCart } = useUI();

  const {
    cart: giftWrapping,
    addItem: addGiftWrapping,
    removeItem: removeGiftWrapping,
  } = useGiftWrapping();

  const { giftItem, addGiftItem, removeGiftItem } = useGiftItem();
  const { sellerCode, addSellerCode, removeSellerCode } = useSellerCode();

  const { items = [], items_qty = 0, currency, totalizers = {} as Totalizers } =
    cart.value ?? {};

  const total = totalizers?.grand_total || 0;
  const subtotal = totalizers?.subtotal || 0;

  const shipping = totalizers?.shipping_amount || 0;
  const discounts = totalizers?.discount_amount || 0;

  const coupon = totalizers?.coupon_code || "";
  const sellerPromoCode = sellerCode.value?.seller_promo_code || "";

  const locale = "pt-BR";
  const currencyCode = currency?.base_currency_code || "BRL";

  const { onUpdateQuantity, onRemoveItem, onAddItem } = useProduct({
    addItem,
    updateItem,
    items: items || [],
    removeGiftItem,
    addGiftItem,
    removeItem,
  });

  const { onSetShipping, onEstimateShipping } = useShipping({
    simulate,
    setSimulate,
  });

  const { onManageGiftWrapping } = useWrapping({
    addGiftWrapping,
    items: items || [],
    removeGiftWrapping,
  });

  const { onManageDiscount, onManageSeller } = useCoupon({
    addCoupon,
    removeCoupon,
    seller: sellerPromoCode,
    removeSeller: removeSellerCode,
    addSeller: addSellerCode,
    coupon,
  });

  const hasEventBeenSent = useSignal(false);
  useSignalEffect(() => {
    if (!displayCart.value) {
      hasEventBeenSent.value = false;
    }
  });

  useSignalEffect(() => {
    const shouldSendEvent = displayCart.value &&
      !hasEventBeenSent.value &&
      cart.value?.items?.length > 0;

    if (shouldSendEvent) {
      hasEventBeenSent.value = true;
      sendEvent({
        name: "view_cart",
        params: {
          currency: currencyCode,
          value: cart.value?.totalizers.grand_total,
          items: cart.value?.items?.map((item) => ({
            ...item,
            quantity: item.qty || 1,
            item_id: item.sku,
          })),
        },
      });
    }
  });

  return (
    <BaseCart
      total={total}
      locale={locale}
      coupon={coupon}
      shipping={shipping}
      subtotal={subtotal}
      discounts={discounts}
      currency={currencyCode}
      loading={loading.value}
      checkoutHref="/checkout"
      cartHref="/checkout/cart"
      itemsQty={items_qty || 0}
      sellerCode={sellerPromoCode}
      freeShippingTarget={freeShippingTarget}
      itemsGift={giftItem?.value?.products?.map(
        ({ entity_id, name, image }: GiftItem) => ({
          itemId: entity_id,
          image: { src: image ?? "", alt: name },
          name,
        }),
      ) || []}
      items={items.map(
        (
          {
            name,
            sku,
            qty,
            images,
            item_id,
            price,
            price_total,
            url,
            extension_attributes,
          }: Item,
        ) => ({
          sku,
          name,
          giftWrapping: {
            options: giftWrapping?.value?.designs_info?.map(
              ({ gw_id, gw_design }: GiftWrappingItem) => ({
                id: gw_id,
                label: gw_design.label,
              }),
            ) || [],
            settings: giftWrapping?.value?.items_info?.find(
              (item: { item_id: number }) => item.item_id === item_id,
            )?.item_info || {
              applied: false,
              available: false,
              gw_id: null,
            },
          },
          image: { src: images?.[0]?.url ?? "", alt: name },
          price: { sale: price, total: price_total },
          quantity: qty,
          url,
          blockQuantity: extension_attributes?.is_personalization ||
            extension_attributes?.is_box,
        } || []),
      )}
      onManageCoupon={async ({ couponCode }: OnManageCoupon) => {
        await onManageDiscount({ couponCode });

        return {
          status: cart.value?.status && cart.value?.status !== 200
            ? "error"
            : "success",
          message: cart.value?.message,
        };
      }}
      onManagePromocode={async ({ couponCode }: OnManageCoupon) => {
        sendEvent({
          event: "button_click",
          params: {
            click_category: "minicart",
            click_text: "clique-aplicar-codigo-vendedor",
            click_description: couponCode,
          },
        });
        await onManageSeller({ couponCode });

        const { success } = sellerCode.value || {};

        return {
          status: success ? "success" : "error",
          message: success ? undefined : "Não há promoção com cupom informado.",
        };
      }}
      onManageGiftWrapping={onManageGiftWrapping}
      onEstimateShipping={onEstimateShipping}
      onUpdateQuantity={onUpdateQuantity}
      onSetShipping={onSetShipping}
      onRemoveItem={onRemoveItem}
      onAddItem={onAddItem}
      itemToAnalyticsItem={(i) => {
        const item = items[i];

        return {
          item_id: item.sku,
          item_name: item.name,
          affiliation: "Main Website - Granado - Granado",
          index: i,
          price: item.price,
          quantity: item.qty,
        };
      }}
    />
  );
};

export default Cart;
