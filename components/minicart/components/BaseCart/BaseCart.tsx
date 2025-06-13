import { AnalyticsItem } from "apps/commerce/types.ts";

import Gifts from "../Gifts/Gifts.tsx";
import Coupon from "../Coupon/index.tsx";

import CartItem from "../CartItem/index.tsx";
import FreeShippingBar from "../FreeShippingBar/index.tsx";
import EstimateShipping from "../EstimateShipping/index.tsx";

import ContentLoading from "../ContentLoading/index.tsx";
import ContentSkeleton from "../ContentSkeleton/index.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import Icon from "../../../ui/Icon.tsx";
import Button from "../../../../components/ui/Button.tsx";

import { useUI } from "../../../../sdk/useUI.ts";
import { formatPrice } from "../../../../sdk/format.ts";

import { sendEvent } from "../../../../sdk/analytics.tsx";
import { Props } from "./types.ts";

const BaseCart = ({
  total,
  items,
  locale,
  loading,
  subtotal,
  shipping,
  onAddItem,
  checkoutHref,
  onSetShipping,
  onUpdateQuantity,
  freeShippingTarget,
  itemToAnalyticsItem,
  onManageGiftWrapping,
  onEstimateShipping,
  onManagePromocode,
  onManageCoupon,
  onRemoveItem,
  sellerCode,
  itemsGift,
  discounts,
  cartHref,
  itemsQty,
  currency,
  coupon,
}: Props) => {
  const isEmpty = itemsQty === 0;
  const { displayCart, displayRemoveProductModal } = useUI();

  return (
    <div
      class="flex flex-col items-center overflow-hidden h-full font-matria"
      style={{ minWidth: "calc(min(100vw, 412px))", maxWidth: "412px" }}
    >
      <div class="flex justify-between items-center pl-[13px] pr-[14px] py-2 w-full">
        <h2 class="flex items-center gap-2 text-green-800 m-0">
          <Show when={isEmpty && loading}>
            <div class="skeleton bg-gray-200 my-1 ml-[3px] h-5 w-5 rounded-full" />
            <span class="block skeleton bg-gray-200 ml-1 h-3.5 w-[105px] rounded-full" />
          </Show>

          <Hide when={isEmpty && loading}>
            <Icon id="ShoppingCart" size={27} />

            <span class="text-base font-normal leading-5">
              <Show when={isEmpty}>Sacola</Show>

              <Hide when={isEmpty}>
                {`${itemsQty} ${itemsQty > 1 ? "itens" : "item"} na sacola`}
              </Hide>
            </span>
          </Hide>
        </h2>

        <Button
          aria-label="Fechar exibição da sacola"
          class="btn-ghost hover:bg-transparent min-h-5 h-5 p-0"
          onClick={() => (displayCart.value = false)}
          title="Fechar"
        >
          <Icon id="XMark" size={20} strokeWidth={0} />
        </Button>
      </div>

      <Show when={isEmpty && !loading}>
        <div class="flex flex-col items-center px-4 mt-6">
          <span class="text-base leading-none">
            Você não possui nenhum item em sua sacola.
          </span>

          <div class="block mt-3 text-base leading-none">
            <span>Clique</span>
            <Button
              class="btn-ghost text-base font-normal leading-none text-green-600 underline border-0 min-h-fit h-fit p-0 hover:bg-transparent"
              onClick={() => {
                displayCart.value = false;
              }}
            >
              aqui
            </Button>
            <span>para continuar comprando</span>
          </div>
        </div>
      </Show>

      <Hide when={isEmpty}>
        <div class="flex-grow mt-3 pb-6 overflow-y-auto w-full scrollbar-webkit">
          <Show when={!!(freeShippingTarget && freeShippingTarget > 0)}>
            <FreeShippingBar
              locale={locale}
              currency={currency}
              target={freeShippingTarget!}
              total={total - (shipping || 0)}
            />
          </Show>

          <div class="px-4">
            <ul
              role="list"
              class="overflow-y-auto flex flex-col gap-3 max-h-72 w-full scrollbar-webkit"
            >
              {items?.map((item, index) => (
                <li key={index}>
                  <CartItem
                    item={item}
                    locale={locale}
                    onRemoveItem={async () => {
                      await onRemoveItem({
                        index,
                        isPromoItems: (item?.price && item.price.sale < 0.01) ||
                          false,
                      });
                    }}
                    onManageGiftWrapping={onManageGiftWrapping}
                    itemToAnalyticsItem={itemToAnalyticsItem}
                    onUpdateQuantity={onUpdateQuantity}
                    currency={currency}
                    index={index}
                  />
                </li>
              ))}
            </ul>

            <Show when={!!(onSetShipping && onEstimateShipping)}>
              <EstimateShipping
                placeholder="Digite seu CEP"
                onEstimateShipping={onEstimateShipping!}
                onSetShipping={onSetShipping!}
              />
            </Show>

            <Show when={!!onManageCoupon}>
              <Coupon
                coupon={coupon}
                onManageCoupon={onManageCoupon!}
                placeholder="Insira seu cupom"
                title="Cupom de desconto"
                type="discount"
              />
            </Show>

            <Show when={!!onManagePromocode}>
              <Coupon
                coupon={sellerCode}
                onManageCoupon={onManagePromocode!}
                placeholder="Insira um código"
                title="Código do vendedor"
                type="seller"
              />
            </Show>
          </div>

          <Show when={!!(itemsGift && itemsGift.length > 0 && onAddItem)}>
            <Gifts items={itemsGift!} onAddItem={onAddItem!} />
          </Show>
        </div>

        <footer class="shadow-[0_3px_28px_rgba(0,0,0,.160)] w-full">
          <div class="flex flex-col gap-3 p-4 pt-6">
            <div class="flex justify-between items-center text-sm	font-normal text-gray-950 leading-4 w-full">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency, locale)}</span>
            </div>

            <Show when={discounts !== 0}>
              <div class="flex justify-between items-center text-sm	font-normal text-gray-950 leading-4 w-full">
                <span>Descontos</span>
                <span>{formatPrice(discounts, currency, locale)}</span>
              </div>
            </Show>

            <Show when={!!shipping && shipping !== 0}>
              <div class="flex justify-between items-center text-sm	font-normal text-gray-950 leading-4 w-full">
                <span>Envio e Manuseio</span>
                <span>{formatPrice(shipping, currency, locale)}</span>
              </div>
            </Show>

            <div class="flex justify-between items-center text-base font-bold text-gray-950 leading-5 w-full">
              <span>Total do pedido</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>
          </div>

          <div class="flex items-center w-full">
            <Button
              id="redirect-cart-button"
              disabled={loading}
              title="Ver e editar sacola"
              aria-label="Ver e editar sacola"
              class="text-base font-normal leading-5 rounded-none p-4 border-l-0 border-green-800 disabled:border-gray-200 hover:border-green-800 text-green-800 disabled:text-gray-600 hover:text-white bg-white disabled:bg-gray-200 hover:bg-green-800 transition-colors ease-in duration-200 h-[52px] w-1/2"
              data-deco="redirect-cart-button"
              onClick={() => {
                globalThis.window.dataLayer.push({
                  event: "button_click",
                  click_category: "mini-cart",
                  click_text: "ver-editar-sacola",
                  click_description:
                    'Clique no botão "Ver e editar sacola" no mini cart',
                });

                globalThis.location.href = cartHref;
              }}
            >
              Ver e editar sacola
            </Button>

            <Button
              id="buy-button"
              disabled={loading}
              data-deco="buy-button"
              title="Finalizar pedido"
              aria-label="Finalizar pedido"
              class="text-base font-normal leading-5 rounded-none p-4 border-l-0 border-green-800 disabled:border-gray-200 hover:border-green-800 text-white disabled:text-gray-600 hover:text-green-800 bg-green-800 disabled:bg-white hover:bg-white transition-colors ease-in duration-200 h-[52px] w-1/2"
              onClick={() => {
                globalThis.window.dataLayer.push({
                  event: "button_click",
                  click_category: "mini-cart",
                  click_text: "finalizar-pedido",
                  click_description:
                    'Clique no botão "Finalizar pedido" no mini cart',
                });

                itemToAnalyticsItem &&
                  sendEvent({
                    name: "begin_checkout",
                    params: {
                      coupon,
                      currency,
                      value: total,
                      items: items
                        .map((_, index) => itemToAnalyticsItem(index))
                        .filter((x): x is AnalyticsItem => Boolean(x)),
                    },
                  });

                globalThis.location.href = checkoutHref;
              }}
            >
              Finalizar pedido
            </Button>
          </div>
        </footer>
      </Hide>

      <Show when={isEmpty && loading}>
        <ContentSkeleton
          showFreeShippingBar={!!(freeShippingTarget && freeShippingTarget > 0)}
        />
      </Show>

      <Show when={!isEmpty && loading && !displayRemoveProductModal.value}>
        <ContentLoading />
      </Show>
    </div>
  );
};

export default BaseCart;
