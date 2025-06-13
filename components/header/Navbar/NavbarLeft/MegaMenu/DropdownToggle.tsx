import Icon from "site/components/ui/Icon.tsx";

export default function DropdownToggle() {
  return (
    <label
      className="group flex items-center space-x-4 py-6"
      htmlFor="mega-menu-dropdown"
    >
      <span class="relative size-5">
        {/* Closed icon */}
        <Icon
          id="Bars3"
          strokeWidth={0.01}
          className={`absolute inset-0 transition-all duration-300 text-sm 2xl:text-[17px] group-hover:text-green-800
          font-matria font-normal h-[20px] w-[20px] 2xl:h-[24px] 2xl:w-[24px] rotate-0 [body:has([data-dropdown-open=true])_&]:rotate-90 [body:has([data-dropdown-open=true])_&]:opacity-0`}
        />
        {/* Opened icon */}
        <Icon
          id="XMark"
          strokeWidth={0.01}
          className={`absolute inset-0 transition-all duration-300 text-sm 2xl:text-[17px] group-hover:text-green-800
          font-matria font-normal h-[20px] w-[20px] 2xl:h-[24px] 2xl:w-[24px] opacity-0 rotate-90 [body:has([data-dropdown-open=true])_&]:rotate-180 [body:has([data-dropdown-open=true])_&]:opacity-100`}
        />
      </span>
      <span className="text-sm 2xl:text-[17px] whitespace-nowrap uppercase 
      group-hover:underline group-hover:text-green-800 font-matria font-normal">
        Ver tudo
      </span>
    </label>
  );
}
