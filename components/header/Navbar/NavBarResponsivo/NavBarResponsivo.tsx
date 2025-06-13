import Cart from "site/islands/Header/Cart.tsx";
import Account from "site/components/header/Navbar/NavBarRight/Account.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Produtos from "site/islands/Header/Produtos.tsx";
import { Buttons } from "site/components/header/Header.tsx";

function NavBarResponsivo(
  { dontUpdateCartAfter, buttons, isLoggedIn }: {
    dontUpdateCartAfter: { addItem: boolean; onLoad: boolean };
    buttons: Buttons;
    isLoggedIn: boolean;
  },
) {
  const commonStyles =
    "p-2 h-full w-full flex items-center justify-center flex-col text-gray-700 hover:text-black font-matria";

  return (
    <div
      className={`fixed bottom-0 left-0 w-full h-[67px] bg-white md:hidden px-4 grid ${
        buttons?.hideCartButton ? "grid-cols-3" : "grid-cols-4"
      }  
    overflow-hidden shadow-top-shadow border-t-[1px] border-gray-200 z-20`}
    >
      <div className={commonStyles}>
        <div className="relative inline-block">
          <div className="flex flex-col items-center justify-center">
            <a
              className={`flex flex-col items-center text-xs font-thin`}
              href="/"
              aria-label="Inicio"
            >
              <Icon id="Home" size={30} strokeWidth={0.01} />
              <span className="md:hidden">Inicio</span>
            </a>
          </div>
        </div>
      </div>
      <div className={commonStyles}>
        <div className="relative inline-block">
          <Produtos />
        </div>
      </div>
      <div className={commonStyles}>
        <Account isLoggedIn={isLoggedIn} />
      </div>
      {!buttons?.hideCartButton && (
        <div className={commonStyles}>
          <Cart dontUpdateCartAfter={dontUpdateCartAfter} />
        </div>
      )}
      <div
        className={`fixed left-0 mt-6 w-full xl:w-4/5 bg-white overflow-hidden transition duration-300 ease-in-out`}
      >
      </div>
    </div>
  );
}

export default NavBarResponsivo;
