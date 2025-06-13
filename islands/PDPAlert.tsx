import { useCart } from "site/sdk/hooks/useCart.ts";
import { useEffect, useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

const BOX_PRODUCT_IDS = [
  "6342",
];

export const PDPAlert = ({ productId }: { productId: string }) => {
  const { cart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cart.value?.items.length) {
      setIsVisible(false);
      return;
    }

    const hasBox = cart.value?.items?.some((item) =>
      item.extension_attributes?.is_box
    );

    if (hasBox || BOX_PRODUCT_IDS.includes(productId)) {
      setIsVisible(true);
    }
  }, [cart.value?.items]);

  if (!isVisible) return null;
  return (
    <div className="flex items-center gap-2 bg-yellow-50 p-4 mb-4  text-amber-700">
      <Icon id="AlertWarning" size={24} />
      <p className="text-sm">
        Não é permitido a finalização de compra do produto de assinatura com
        outros produtos.
      </p>
    </div>
  );
};
