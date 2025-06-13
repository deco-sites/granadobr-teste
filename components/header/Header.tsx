import { type SectionProps } from "@deco/deco";
import { usePartialSection, useScriptAsDataURI } from "@deco/deco/hooks";
import { getCookies } from "@std/http";
import type { ImageWidget } from "apps/admin/widgets.ts";
import NavbarMobile from "site/components/header/Navbar/NavBarResponsivo/NavBarMobile.tsx";
import { Props as AccountProps } from "site/components/header/Navbar/NavBarRight/AccountItems.tsx";
import ProdutosModal from "site/islands/Header/ProdutosModal.tsx";
import Searchbar from "site/islands/Header/Searchbar.tsx";
import { AppContext } from "../../apps/site.ts";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";
import CartSide from "../../islands/Header/CartSide.tsx";
import { clx } from "../../sdk/clx.ts";
import BackgroundProvider from "./BackgroundProvider.tsx";
import Navbar from "./Navbar/Navbar.tsx";
import NavBarResponsivo from "./Navbar/NavBarResponsivo/NavBarResponsivo.tsx";
import Scroll from "./Scroll.tsx";
import TopBar from "../../islands/Header/Bartop.tsx"
import { SiteNavigationElement } from "./types.ts";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface Buttons {
  hideSearchButton?: boolean;
  hideAccountButton?: boolean;
  hideWishlistButton?: boolean;
  hideCartButton?: boolean;
}
export interface AlertProps {
  message: string;
  url?: string;
}
export interface Props {
  alerts?: {
    alerts: AlertProps[];
    interval?: number;
  };
  /**
   * @default true
   */
  hideSwitcher?: boolean;
  searchbar?: Omit<SearchbarProps, "platform">;
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[];
  /** @title Logo */
  logo: {
    whiteBackground?: Logo;
    TransparentBackground?: Logo;
  };
  logoPosition?: "left" | "center";
  /**
   * @title Free Shipping Target
   * @description Show free shipping progress on Minicart
   * @default 0
   */
  freeShippingTarget?: number;
  account: AccountProps;
  cartType?: "CartSaver" | "Cart";
  cartSaver?: {
    title?: string;
    description?: string;
    successMessage?: string;
    failureMessage?: string;
  };
  buttons?: Buttons;
  /**
   * @ignore
   */
  device?: "desktop" | "tablet" | "mobile";
  url?: string;
}
function Header({
  logo,
  alerts,
  navItems,
  freeShippingTarget,
  logoPosition = "center",
  dontUpdateCartAfter,
  searchbar,
  account,
  buttons,
  cartType,
  device,
  cartSaver,
  hideSwitcher,
  ssrPathname,
  isLoggedIn,
}: SectionProps<typeof loader>) {
  const items = navItems ?? [];
  const hasTopBar = !hideSwitcher && alerts?.alerts &&
    alerts?.alerts.length > 0;
  const isHomePage = ssrPathname === "/" || ssrPathname === "/black-friday";
  return (
    <header id="header">
      <script
        defer
        type="module"
        src={useScriptAsDataURI((device: string) => {
          const deskButton = document.getElementById(
            "desktop-navbar",
          ) as HTMLButtonElement;
          const mobileButton = document.getElementById(
            "mobile-navbar",
          ) as HTMLButtonElement;
          globalThis.window.addEventListener("resize", () => {
            const isDesktop = device === "desktop";
            const windowWidth = globalThis.window.innerWidth;
            if (windowWidth > 1000 && !isDesktop) {
              deskButton!.click();
            } else if (windowWidth < 1000 && isDesktop) {
              mobileButton!.click();
            }
          });
        }, device)}
      />
      <input
        type="checkbox"
        class="hidden"
        checked={device === "desktop"}
        id="is-desktop"
      />
      <button
        {...usePartialSection({ props: { device: "mobile" } })}
        class="hidden"
        name="my_tabs_1"
        id="mobile-navbar"
        type="button"
      />
      <button
        {...usePartialSection({ props: { device: "desktop" } })}
        class="hidden"
        name="my_tabs_2"
        id="desktop-navbar"
        type="button"
      />
      <div class="w-full">
        <CartSide
          cartType={cartType}
          freeShippingTarget={freeShippingTarget}
        >
          <div
            className={clx(
              "w-full z-20",
              !isHomePage && "relative h-[71px]",
              !isHomePage
                ? hasTopBar ? "lg:h-[151px]" : "lg:h-[116px]"
                : hasTopBar
                ? "h-[71px] md:h-[35px]"
                : "fixed",
            )}
          >
            <Scroll>
              {hasTopBar && (
                <TopBar
                  alerts={alerts?.alerts}
                  interval={alerts?.interval}
                  device={device}
                  hideSwitcher={hideSwitcher}
                />
              )}
              <BackgroundProvider
                isHomePage={isHomePage}
                device={device}
              >
                {device === "mobile"
                  ? (
                    <NavbarMobile
                      logo={logo.TransparentBackground}
                      buttons={buttons}
                    />
                  )
                  : (
                    <Navbar
                      isLoggedIn={isLoggedIn}
                      logo={logo}
                      buttons={buttons}
                      dontUpdateCartAfter={dontUpdateCartAfter}
                      searchbar={searchbar &&
                        { ...searchbar }}
                      logoPosition={logoPosition}
                      account={account}
                      items={items}
                      cartType={cartType || "Cart"}
                    />
                  )}
              </BackgroundProvider>
            </Scroll>
          </div>
        </CartSide>
      </div>

      <Searchbar
        device={device}
        searchbar={searchbar}
        dontUpdateCartAfter={dontUpdateCartAfter}
        hasTopBar={hasTopBar}
      >
        <ProdutosModal items={items} />
      </Searchbar>

      <NavBarResponsivo
        dontUpdateCartAfter={dontUpdateCartAfter}
        buttons={buttons ?? {}}
        isLoggedIn={isLoggedIn}
      />
    </header>
  );
}
export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const pathname = new URL(req.url).pathname;
  const cookies = getCookies(req.headers);
  const isLoggedIn = !!cookies.dataservices_customer_id;
  return {
    ...props,
    ssrPathname: pathname,
    dontUpdateCartAfter: {
      addItem: ctx.features.dontUpdateCartAfterAddItem ?? false,
      onLoad: ctx.features.dangerouslyDisableOnLoadUpdate ?? false,
    },
    device: props.device || ctx.device,
    url: req.url,
    isLoggedIn,
  };
};
export default Header;
