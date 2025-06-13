import AccountItems, {
  Props as AccountProps,
} from "site/components/header/Navbar/NavBarRight/AccountItems.tsx";
import DropdownTrigger from "site/components/header/Navbar/NavBarRight/DropdownTrigger.tsx";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  className?: string;
  account?: AccountProps;
  isLoggedIn: boolean;
}

function Account({ className, account, isLoggedIn }: Props) {
  const icon = {
    id: "User",
    ariaLabel: "Account",
    className:
      `flex flex-col items-center h-[-30px] w-[30px] text-xs font-thin tx-mr-eaves-xl-sans ${className}`,
    width: 30,
    height: 30,
    label: "Account",
    iconClassName: "",
    textClassName: "text-[12px] font-matria font-normal md:hidden",
  };

  return (
    <>
      {account && (
        <div className="hidden md:block">
          <DropdownTrigger className="md:ml-5 group" icon={icon}>
            <AccountItems account={account} isLoggedIn={isLoggedIn} />
          </DropdownTrigger>
        </div>
      )}

      <div className="block md:hidden">
        <a
          className={`flex flex-col items-center h-[-30px] w-[30px] text-xs font-thin tx-mr-eaves-xl-sans ${className}`}
          href={`/granado/customer/account/login/referer/${
            btoa(globalThis.location.href)
          }/`}
          aria-label="Account"
        >
          <Icon id="User" size={30} strokeWidth={0.01} />
          <span className="md:hidden">Conta</span>
        </a>
      </div>
    </>
  );
}

export default Account;
