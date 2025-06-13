import Icon from "../../../../components/ui/Icon.tsx";
import Button from "../../../../components/ui/Button.tsx";

import Show from "../../../../directives/Show/index.tsx";
import { Props } from "./types.ts";

const ModalContent = (
  {
    title,
    onRefuse,
    isLoading,
    onCancelLabel,
    onConfirmLabel,
    description,
    onConfirm,
    content,
  }: Props,
) => {
  return (
    <div class="relative lg:bottom-[154px] bottom-[20%] font-matria text-gray-950">
      <div class="modal-box p-4 rounded w-[380px] transition-none shadow-none">
        <div class="flex justify-center items-center">
          <h3 class="text-base font-bold leading-5 grow text-center">
            {title}
          </h3>

          <Button
            title="Fechar"
            disabled={isLoading}
            aria-label="Fechar modal"
            class="btn-ghost hover:bg-transparent min-h-5 h-5 max-w-5 p-0"
            onClick={onRefuse}
          >
            <Icon id="XMark" size={20} strokeWidth={0} />
          </Button>
        </div>

        <p class="text-sm leading-[18px] my-5">
          {description}
        </p>

        <div class="block">
          {content}
        </div>

        <div class="flex flex-col-reverse lg:flex-row justify-center items-center gap-4">
          <Button
            title="Cancelar"
            disabled={isLoading}
            aria-label="Fechar modal"
            class="text-sm font-normal leading-5 rounded p-2 border-green-800 disabled:border-gray-200 hover:border-green-800 text-green-800 disabled:text-gray-600 hover:text-white bg-white disabled:bg-gray-200 hover:bg-green-800 transition-colors ease-in duration-200 h-10 min-h-fit min-w-24 w-full lg:w-fit"
            onClick={onRefuse}
          >
            {onCancelLabel ?? "Cancelar"}
          </Button>

          <Button
            title="Remover"
            disabled={isLoading}
            class="text-sm font-normal leading-5 rounded p-2 border-green-800 disabled:border-gray-200 hover:border-green-800 text-white disabled:text-gray-600 hover:text-green-800 bg-green-800 disabled:bg-gray-200 hover:bg-white transition-colors ease-in duration-200 h-10 min-h-fit min-w-24 w-full lg:w-fit"
            aria-label={onConfirmLabel ?? "Confirmar"}
            onClick={onConfirm}
          >
            <Show when={isLoading}>
              <span class="loading loading-spinner absolute w-[22px]" />
            </Show>

            <span
              {...(isLoading && { class: "opacity-0 invisible" })}
            >
              {onConfirmLabel ?? "Confirmar"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
