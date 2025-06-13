export interface Props {
  myAccount: string;
  createAccount: string;
  myOrders: string;
  loginItem: string;
  logoutItem: string;
}

function AccountItems({
  account,
  isLoggedIn,
}: { account: Props; isLoggedIn: boolean }) {
  const { myAccount, createAccount, myOrders, loginItem, logoutItem } = account;

  return (
    <div className="absolute inline-block text-left">
      <div className="absolute mt-6 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 md:origin-top-right md:-right-16">
        <div className="absolute top-0.5 -translate-x-1/2 -mt-2 left-1/4 md:left-3/4">
          <div className="bg-white rotate-45 transform origin-bottom-left -translate-y-1/2 border-t border-l h-3 w-3">
          </div>
        </div>
        <ul
          className="py-4 px-8 w-[180px]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <li id="my-account" className="flex py-2 w-full h-full font-normal font-matria text-base">
            <a
              href="/granado/customer/account/"
              className="text-gray-700 block"
              role="menuitem"
              id="idEeMUXVfa"
            >
              {myAccount}
            </a>
          </li>
          <li id="create-account"
            className={`flex py-2 w-full h-full font-normal font-matria text-base ${
              isLoggedIn ? "hidden" : ""
            }`}
          >
            <a
              href="/granado/customer/account/"
              className="text-gray-700 block"
              role="menuitem"
              id="idq8BMWDIM"
            >
              {createAccount}
            </a>
          </li>
          <li id="my-orders" className="flex py-2 w-full h-full font-normal font-matria text-base">
            <a
              href="/granado/sales/order/history/"
              className="text-gray-700 block"
              role="menuitem"
            >
              {myOrders}
            </a>
          </li>
          <li id="trigger-login" className="flex py-2 w-full h-full font-normal font-matria text-base">
            <a
              href={isLoggedIn
                ? "/granado/customer/account/logout/"
                : `/granado/customer/account/login/referer/${
                  btoa(globalThis.location.href)
                }/`}
              className="text-gray-700 block"
              role="menuitem"
            >
              {isLoggedIn ? logoutItem : loginItem}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AccountItems;
