import { JSX } from "preact";
import { useRef } from "preact/hooks";

import { useSignal } from "@preact/signals";

import Icon from "../../../ui/Icon.tsx";
import Divider from "../Divider/index.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { useToast } from "../../../../sdk/useToast.ts";
import { validateEmail } from "../../../../sdk/validate.ts";

import { invoke } from "../../../../runtime.ts";
import { Props } from "./types.ts";

const Newsletter = ({ content }: Props) => {
  const isValid = useSignal(true);
  const isLoading = useSignal(false);

  const { addToast } = useToast();
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!inputEl.current) return;
    const email = inputEl.current.value.trim();

    if (!validateEmail(email)) {
      inputEl.current.focus();
      isValid.value = false;

      return;
    }

    try {
      isValid.value = true;
      isLoading.value = true;

      const result = await invoke.magento.actions.newsletter.subscribe({
        email,
      });

      if (result) {
        const { message, success } = result;

        addToast({
          type: success ? "success" : "warning",
          message: message ||
            "Ocorreu um erro inesperado. <br/> Tente novamente mais tarde.",
        });

        return;
      }

      throw new Error();
    } catch (_e) {
      addToast({
        type: "error",
        message:
          "Ocorreu um erro inesperado. <br/> Tente novamente mais tarde.",
      });
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <>
      <div class="max-w-screen-xl mx-auto w-full mt-14 md:my-10 lg:my-16">
        <div class="flex flex-col items-center gap-10 md:gap-9 lg:gap-6 md:flex-row md:w-full md:justify-center lg:justify-between md:bg-white px-4 lg:px-14 md:py-8 lg:py-12 rounded">
          <Show when={!!content?.title}>
            <h4 class="text-2xl md:text-xl lg:text-[32px] leading-6 md:leading-5 lg:leading-10 font-normal text-white md:text-green-800 text-center md:text-left mx-10 md:mx-0 md:max-w-64 lg:max-w-max">
              {content?.title}
            </h4>
          </Show>

          <div class="flex flex-col pb-10 md:pb-0 w-full md:w-auto">
            <form
              class="form-control relative"
              onSubmit={onSubmit}
              id="form-newsletter"
            >
              <div class="flex flex-col gap-2 relative grow">
                <input
                  name="email"
                  ref={inputEl}
                  class={`input md:h-10 lg:h-12 bg-white pr-12 border-0 md:border lg:border-2 border-solid border-green-800 rounded focus:outline-none focus:border-green-800 text-sm md:w-64 lg:w-96 ${
                    isValid.value
                      ? "placeholder:text-gray-600"
                      : "placeholder:text-red-600 md:placeholder:text-gray-600"
                  }`}
                  placeholder={content?.placeholder || "Digite seu e-mail"}
                />

                <Hide when={isValid.value}>
                  <span class="absolute -bottom-6 md:-bottom-8 lg:-bottom-6 text-xs leading-[15px] text-white md:text-red-600">
                    Por favor insira um endereço de e-mail válido (Ex:
                    exemplo@dominio.com).
                  </span>
                </Hide>
              </div>

              <button
                type="submit"
                disabled={isLoading.value}
                class="disabled:loading text-green-800 absolute right-4 lg:right-3 top-2/4 -translate-y-1/2"
                aria-label="Inscrever-se"
                title="Inscrever-se"
              >
                <Icon id="ArrowRight" size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Divider />
    </>
  );
};

export default Newsletter;
