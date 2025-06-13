import Icon from "../../../components/ui/Icon.tsx";
import { useUI } from "../../../sdk/useUI.ts";

export default function SearchButton() {
  const { displaySearchPopup } = useUI();

  return (
    <>
      <div className="hidden xl:flex items-center w-[200px] 2xl:w-[300px] h-[48px] bg-[#f6f3f8] rounded-[5px] overflow-hidden">
        <button
          className="group flex items-center justify-evenly w-full sm:flex"
          aria-label="search icon button"
          onClick={() => {
            displaySearchPopup.value = !displaySearchPopup.value;
          }}
        >
          <input
            type="text"
            className="flex-grow px-4 py-3 w-full focus:outline-none bg-[#f6f3f8] text-base font-normal placeholder-[#ABABAB] font-matria"
            placeholder="O que você está buscando hoje?"
            aria-label="Search box"
          />
          <div className="w-10">
            <Icon
              id="MagnifyingGlass"
              size={28}
              strokeWidth={0.1}
              className="text-green-800 opacity-50"
            />
          </div>
        </button>
      </div>

      <button
        className="xl:hidden flex items-center justify-evenly ml-4 w-10 h-10"
        aria-label="search icon button"
        onClick={() => {
          displaySearchPopup.value = !displaySearchPopup.value;
        }}
      >
        <Icon id="MagnifyingGlass" size={28} strokeWidth={0.1} />
      </button>
    </>
  );
}
