import DropdownTrigger from "site/components/header/Navbar/NavBarRight/DropdownTrigger.tsx";
import LanguageSelectorItems from "site/components/header/Navbar/NavBarRight/LanguageSelector/LanguageSelectorItems.tsx";

const LanguageSelector: React.FC = () => {
  const icon = {
    id: "FlagBr",
    ariaLabel: "Flag Br",
    className: "flex cursor-pointer mr-2 font-matria",
    width: 30,
    height: 20,
    label: "BR",
    iconClassName: "mr-2.5",
    textClassName: "text-sm font-matria font-normal uppercase",
  };

  return (
    <DropdownTrigger className="md:ml-5 group" icon={icon}>
      <LanguageSelectorItems />
    </DropdownTrigger>
  );
};

export default LanguageSelector;
