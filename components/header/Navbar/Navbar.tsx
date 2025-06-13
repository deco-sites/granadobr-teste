import type { SiteNavigationElement } from "apps/commerce/types.ts";
import { Buttons, Logo } from "site/components/header/Header.tsx";
import Account from "site/components/header/Navbar/NavBarRight/Account.tsx";
import {
  Props as AccountProps,
} from "site/components/header/Navbar/NavBarRight/AccountItems.tsx";
import LanguageSelector from "site/components/header/Navbar/NavBarRight/LanguageSelector/LanguageSelector.tsx";
import Wishlist from "site/components/header/Navbar/NavBarRight/Wishlist.tsx";
import { SearchButton } from "site/islands/Header/Buttons.tsx";
import NavbarMenuItems from "site/islands/Header/NavbarMenuItems.tsx";
import Cart from "../../../islands/Header/Cart.tsx";
import type { Props as SearchbarProps } from "../../search/Searchbar.tsx";
import HeaderLogo from "../Navbar/HeaderLogo.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function Navbar({
  logo,
  items,
  dontUpdateCartAfter,
  logoPosition = "left",
  buttons,
  account,
  cartType,
  isLoggedIn,
}: {
  dontUpdateCartAfter: {
    onLoad: boolean;
    addItem: boolean;
  };
  cartType: string;
  items: SiteNavigationElement[];
  searchbar?: Omit<SearchbarProps, "platform">;
  logo?: {
    whiteBackground?: Logo;
    TransparentBackground?: Logo;
  };
  buttons?: Buttons;
  logoPosition?: "left" | "center";
  account: AccountProps;
  isLoggedIn: boolean;
}) {
  return (
    <>
      <div
        className="hidden md:order-1 md:flex md:flex-1 md:justify-start"
        id="mmenu"
      >
        <NavbarMenuItems items={items} logoPosition={logoPosition} />
      </div>

      <div className="order-2 flex items-center justify-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2">
        {logo && <HeaderLogo logo={logo} />}
      </div>

      <div className="order-5 md:order-3 md:flex md:items-center md:justify-end">
        {!buttons?.hideSearchButton && <SearchButton />}
      </div>

      <div className="order-1 md:order-4 md:flex md:items-center md:justify-end">
        <LanguageSelector />
      </div>

      <div className="order-5 md:flex md:items-center md:justify-end">
        <div className="flex-none flex items-center col-span-1">
          <div className="hidden md:flex md:items-center md:justify-end">
            <div className={`ml-4`} id="account-button">
              {!buttons?.hideAccountButton && (
                <Account account={account} isLoggedIn={isLoggedIn} />
              )}
            </div>
            <div className={`ml-4`} id="wishlist-button">
              {!buttons?.hideWishlistButton && <Wishlist />}
            </div>
            <div className={`ml-4`}>
              {!buttons?.hideCartButton && (
                <Cart
                  dontUpdateCartAfter={dontUpdateCartAfter}
                  cartType={cartType}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
