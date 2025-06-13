import Button from "site/components/ui/Button.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useComputed, useSignal } from "@preact/signals";
import { useWishlist } from "site/sdk/hooks/useWishlist.ts";
import { useEffect, useState } from "preact/hooks";
import { sendEvent } from "site/sdk/analytics.tsx";
import { AddToWishlistEvent } from "apps/commerce/types.ts";
import { getCookie } from "site/utils/cache-client/cookie.ts";

interface Props {
  productID: string;
  productGroupID: string;
  variant?: "icon" | "full";
  notLogged?: (notLogged: boolean) => void;
  size: number;
  analyticsItem: AddToWishlistEvent["params"]["items"][0];
}

function WishlistButton({
  variant = "icon",
  productGroupID,
  productID,
  size = 30,
  analyticsItem,
}: Props) {
  const fetching = useSignal(false);
  const { loading, addItem, removeItem, getItem } = useWishlist();
  const item = { sku: productID, productId: productGroupID! };
  const listItem = useComputed(() => getItem({ product_id: item.productId }));
  const [_isClicked, setIsClicked] = useState(false);

  const inWishlist = Boolean(listItem.value);

  const reloadWishlistPage = () => {
    if (globalThis.window.location.pathname === "/wishlist") {
      globalThis.window.location.reload();
    }
  };

  const verifyWishlist = async () => {
    const customerId = getCookie("dataservices_customer_id");

    if (!customerId) {
      sessionStorage.setItem("wishlistProduct", JSON.stringify(item));
      setIsClicked(true);
      // displayWishlistModal.value = true;
      // notLogged && notLogged(true);
      globalThis.location.pathname =
        `/granado/customer/account/login/?returnUrl=${globalThis.location.pathname}`;
      return;
    }

    if (loading.value) {
      return;
    }

    try {
      fetching.value = true;

      if (inWishlist) {
        const deleteItemParams = JSON.parse(listItem.value!.delete_item_params);
        await removeItem({ productId: deleteItemParams.data.item });

        reloadWishlistPage();
      }

      if (!inWishlist) {
        sendEvent({
          name: "add_to_wishlist",
          params: { items: [analyticsItem] },
        });
        await addItem(item);
      }
    } finally {
      fetching.value = false;
    }
  };

  useEffect(() => {
    const wishlistProduct = sessionStorage.getItem("wishlistProduct");

    const product = wishlistProduct && JSON.parse(wishlistProduct);

    if (!product || product.sku !== productID) return;

    // const interval = setInterval(() => {
    //   const userLogged = useUser();
    //   if (!userLogged.loading.value) {
    //     clearInterval(interval);

    //     if (userLogged.user?.value?.email) {
    //       setUser(userLogged.user);
    //       sessionStorage.removeItem("wishlistProduct");
    //       verifyWishlist();
    //     }
    //   }
    // }, 1000);
  }, []);

  return (
    <Button
      class={variant === "icon"
        ? "gap-2 max-w-[35px] h-[35px] min-h-[35px] hover:bg-inherit justify-end py-0 px-1 group/wishlist font-matria"
        : "gap-2 btn-ghost font-matria text-lg font-normal"}
      loading={fetching.value}
      aria-label="Add to wishlist"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (variant !== "icon") {
          globalThis.window.dataLayer.push({
            event: "button_click",
            click_category: "product",
            click_text: "clique-add-lista-favoritos",
            click_description: "Adicionar a lista de favoritos",
          });
        }

        verifyWishlist();
      }}
    >
      <div class="relative">
        <Icon
          id="Heart"
          size={size}
          strokeWidth={0.01}
          class={`text-green-800 ${inWishlist ? "opacity-0" : ""}`}
        />
        <Icon
          id="HeartFill"
          size={size}
          strokeWidth={0.01}
          class={`text-green-800 ${
            inWishlist ? "opacity-100" : "opacity-0"
          } group-hover/wishlist:opacity-100 absolute transition-opacity duration-300 top-0`}
        />
      </div>
      {variant === "icon"
        ? null
        : inWishlist
        ? "Remover"
        : "Adicionar à lista de favoritos"}
    </Button>
  );
}

export default WishlistButton;
