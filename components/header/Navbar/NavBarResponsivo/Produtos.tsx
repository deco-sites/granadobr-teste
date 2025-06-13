import Icon from "site/components/ui/Icon.tsx";
import { useUI } from "site/sdk/useUI.ts";

function Produtos() {
  const { displayMegaMenuResponsivo, displaySearchPopup } = useUI();

  return (
    <div className="relative">
      <div className="xl:hidden flex justify-center p-2">
        <button
          className="flex items-center justify-center w-7 h-7 border-none"
          onClick={() => {
            displayMegaMenuResponsivo.value = !displayMegaMenuResponsivo.value;
            displaySearchPopup.value = !displaySearchPopup.value;
          }}
        >
          <div className="flex flex-col items-center justify-center text-xs font-thin tx-mr-eaves-xl-sans">
            <Icon id="Produtos" width={30} height={30} strokeWidth={0.01} />
            <span>Produtos</span>
          </div>
        </button>
      </div>
    </div>
  );
}
export default Produtos;
