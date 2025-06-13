import { SiteNavigationElement } from "apps/commerce/types.ts";

interface NavItemProps {
  item: SiteNavigationElement;
  onDropdownToggle: (event: MouseEvent, item: SiteNavigationElement) => void;
  isMainMenu?: boolean;
}

function NavItem({ item, onDropdownToggle, isMainMenu = false }: NavItemProps) {
  const { name, url } = item;

  return (
    <a
      href={url || "#"}
      className={`group ${
        !isMainMenu
          ? "pr-4 pt-3 pb-3 pl-4 lg:pl-8  2xl:pl-16 w-full "
          : "flex items-center space-x-4 py-6 font-matria font-normal"
      }`}
      onClick={(event) => onDropdownToggle(event, item)}
    >
      <span
        className={`${
          isMainMenu
            ? "uppercase text-sm 2xl:text-[17px] whitespace-nowrap group-hover:underline group-hover:text-green-800 font-normal"
            : "text-[16px] "
        } font-matria`}
      >
        {name}
      </span>
    </a>
  );
}
export default NavItem;
