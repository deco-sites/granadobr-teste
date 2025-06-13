import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "ArrowsPointingOut"
  | "Bars3"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "ChevronDown"
  | "CreditCard"
  | "Deco"
  | "Diners"
  | "Discord"
  | "Discount"
  | "Elo"
  | "Facebook"
  | "FilterList"
  | "Heart"
  | "Instagram"
  | "LinkedIn"
  | "Minus"
  | "MapPin"
  | "MagnifyingGlass"
  | "Mastercard"
  | "Message"
  | "Phone"
  | "Pix"
  | "Plus"
  | "QuestionMarkCircle"
  | "Return"
  | "Ruler"
  | "ShoppingCart"
  | "Star"
  | "TikTok"
  | "Trash"
  | "Truck"
  | "X"
  | "User"
  | "Visa"
  | "WhatsApp"
  | "XMark"
  | "Zoom"
  | "Alert"
  | "AlertInfo"
  | "AlertSuccess"
  | "AlertWarning"
  | "AlertError"
  | "Amex"
  | "Boleto"
  | "YouTube"
  | "Granado"
  | "Phebo"
  | "ArrowRight"
  | "Storefront"
  | "DoubtCircle"
  | "NotFound"
  | "Home"
  | "share"
  | "EntregaExpressa"
  | "Frete"
  | "Parcelamento"
  | "RetiradaLoja"
  | "Desconto"
  | "FlagBr"
  | "FlagUsa"
  | "FlagUk"
  | "FlagFr"
  | "FlagEn"
  | "FlagPt"
  | "DownSort"
  | "CodigoVendedor"
  | "Sort"
  | "Store"
  | "DiscountTag";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/sprites.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon({
  id,
  size,
  strokeWidth = 16,
  height,
  width,
  ...otherProps
}: Props) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
