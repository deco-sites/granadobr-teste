import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";

import RemoveItem from "../RemoveItem/index.tsx";
import GiftWrapping from "../GiftWrapping/index.tsx";

import Image from "apps/website/components/Image.tsx";
import Icon from "../../../../components/ui/Icon.tsx";

import Button from "../../../../components/ui/Button.tsx";
import QuantitySelector from "../../../../components/ui/QuantitySelector.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { formatPrice } from "../../../../sdk/format.ts";
import { sendEvent } from "../../../../sdk/analytics.tsx";

import { useUI } from "../../../../sdk/useUI.ts";
import { useModalSample } from "../../../../sdk/useModalSample.ts";

import { Props } from "./types.ts";

const CartItem = ({
  item,
  index,
  onRemoveItem,
  itemToAnalyticsItem,
  onManageGiftWrapping,
  onUpdateQuantity,
  currency,
  locale,
}: Props) => {
  const {
    url,
    name,
    price: { sale, list, total },
    giftWrapping,
    quantity,
    image,
    // @ts-expect-error - Check if this exists, if so, add to typing
    blockQuantity,
  } = item;

  const { showModal } = useModalSample();
  const { displayRemoveProductModal } = useUI();

  const isGift = sale < 0.01;
  const loading = useSignal(false);

  const withLoading = useCallback(
    <A,>(cb: (args: A) => Promise<void> | void) => async (e: A) => {
      try {
        loading.value = true;
        await cb(e);
      } finally {
        loading.value = false;
      }
    },
    [],
  );

  return (
    <div class="flex flex-col bg-purple-100 rounded p-4 gap-4">
      <div class="flex gap-4">
        <Show when={!!url && !isGift}>
          <a
            href={url}
            aria-label={name}
            class="w-full max-w-[54px] h-[70px] relative"
          >
            <Show when={!!image?.src.length}>
              <div class="skeleton bg-gray-200 h-full w-full rounded" />

              {image && (
                <Image
                  {...image}
                  class="absolute inset-0 h-fit rounded"
                  height={70}
                  width={54}
                  fetchPriority="low"
                  loading="lazy"
                />
              )}
            </Show>

            <Hide when={!!image?.src.length}>
              <div class="flex justify-center w-full max-w-[54px] h-[70px] rounded bg-[#F3F4F6] text-[#B9BDC8] border border-gray-200">
                <Icon
                  height={28}
                  class="mt-4"
                  strokeWidth={0}
                  id="NotFound"
                  width={36}
                />
              </div>
            </Hide>
          </a>
        </Show>

        <Hide when={!!url && !isGift}>
          <div class="w-full max-w-[54px] relative">
            <Show when={!!image?.src.length}>
              <div class="skeleton bg-gray-200 h-full w-full rounded" />

              {image && (
                <Image
                  {...image}
                  class="absolute inset-0 h-fit rounded"
                  height={70}
                  width={54}
                  fetchPriority="low"
                  loading="lazy"
                />
              )}
            </Show>

            <Hide when={!!image?.src.length}>
              <div class="flex justify-center w-full max-w-[54px] h-[70px] rounded bg-[#F3F4F6] text-[#B9BDC8] border border-gray-200">
                <Icon
                  height={28}
                  class="mt-4"
                  strokeWidth={0}
                  id="NotFound"
                  width={36}
                />
              </div>
            </Hide>
          </div>
        </Hide>

        <div class="flex flex-col gap-3 w-full">
          <div class="flex items-center justify-between gap-8">
            <Show when={!!url && !isGift}>
              <a
                href={url}
                aria-label={name}
                class="text-base leading-5 line-clamp-1 text-gray-950"
              >
                {isGift && !name.includes("Brinde") && "Brinde - "}
                {name}
              </a>
            </Show>

            <Hide when={!!url && !isGift}>
              <div class="text-base leading-5 line-clamp-1 text-gray-950">
                {isGift && !name.includes("Brinde") && "Brinde - "}
                {name}
              </div>
            </Hide>

            <Button
              title="Excluir"
              disabled={loading.value}
              aria-label="Excluir produto da sacola"
              class="btn-ghost hover:bg-transparent min-h-5 h-5 max-w-5 p-0"
              onClick={withLoading(() => {
                displayRemoveProductModal.value = true;

                showModal({
                  title: "Remover item",
                  description:
                    "Tem certeza que gostaria de remover este item da sacola de compras?",
                  onConfirmLabel: "Remover item",
                  onConfirm: async () => {
                    await onRemoveItem({ index });

                    if (itemToAnalyticsItem) {
                      const analyticsItem = itemToAnalyticsItem(index);

                      analyticsItem &&
                        sendEvent({
                          name: "remove_from_cart",
                          params: { items: [analyticsItem], currency: "BRL" },
                        });
                    }

                    displayRemoveProductModal.value = false;
                  },
                  onCancel: () => {
                    displayRemoveProductModal.value = false;
                  },
                  content: (
                    <RemoveItem
                      name={name}
                      locale={locale}
                      currency={currency}
                      isGift={isGift}
                      image={image}
                      sale={sale}
                    />
                  ),
                });
              })}
            >
              <Icon id="XMark" size={20} strokeWidth={0} />
            </Button>
          </div>

          <div class="flex items-end justify-between">
            <QuantitySelector
              quantity={quantity}
              disabled={loading.value || isGift || blockQuantity}
              onChange={withLoading(async (quantity) => {
                const diff = quantity - item.quantity;
                await onUpdateQuantity?.({ quantity, index });

                if (itemToAnalyticsItem) {
                  const analyticsItem = itemToAnalyticsItem(index);

                  analyticsItem &&
                    sendEvent({
                      name: diff < 0 ? "remove_from_cart" : "add_to_cart",
                      params: {
                        items: [{ ...analyticsItem, quantity: Math.abs(diff) }],
                      },
                    });
                }
              })}
            />

            <div class="flex items-baseline gap-2 text-gray-950 max-h-5">
              <Show when={quantity > 1 && sale > 0}>
                <span class="font-medium text-xs leading-5">
                  ({formatPrice(sale, currency, locale)})
                </span>
              </Show>

              <span class="font-semibold text-base leading-5">
                <Show when={isGift}>Grátis</Show>

                <Hide when={isGift}>
                  {formatPrice(total || list, currency, locale)}
                </Hide>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Show
        when={!!giftWrapping?.settings?.available &&
          !!giftWrapping?.options?.length &&
          !!onManageGiftWrapping}
      >
        <GiftWrapping
          index={index}
          giftWrapping={giftWrapping!}
          onManageGiftWrapping={onManageGiftWrapping!}
        />
      </Show>
    </div>
  );
};

export default CartItem;
