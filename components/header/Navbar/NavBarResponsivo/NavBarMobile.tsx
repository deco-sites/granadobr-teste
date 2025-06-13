import Image from "apps/website/components/Image.tsx";
import { Buttons, Logo } from "site/components/header/Header.tsx";
import LanguageSelector from "site/components/header/Navbar/NavBarRight/LanguageSelector/LanguageSelector.tsx";
import { SearchButton } from "site/islands/Header/Buttons.tsx";
import type { Props as SearchbarProps } from "../../../search/Searchbar.tsx";

// Make it sure to render it on the server only. DO NOT render it on an island
function NavbarMobile({
  logo,
  buttons,
}: {
  searchbar?: Omit<SearchbarProps, "platform">;
  logo?: Logo;
  buttons?: Buttons;
}) {
  return (
    <>
      <div className="order-2 flex items-center justify-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2">
        {logo && (
          <a
            href="/"
            aria-label="Granado logo"
            className="flex items-center justify-center max-w-[137.14px] 2xl:max-w-[160px] max-h-[60px] 2xl:max-h-[70px]"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 160}
              height={logo.height || 70}
              loading="eager"
              preload
              fetchPriority="high"
            />
          </a>
        )}
      </div>
      <div className="order-5 md:order-3 md:flex md:items-center md:justify-end">
        {!buttons?.hideSearchButton && <SearchButton />}
      </div>
      <div className="order-1 md:order-4 md:flex md:items-center md:justify-end">
        <LanguageSelector />
      </div>
    </>
  );
}

export default NavbarMobile;
