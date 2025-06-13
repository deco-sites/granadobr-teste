import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";

import Show from "../../directives/Show/index.tsx";
import Hide from "../../directives/Hide/index.tsx";

export interface Props {
  /** @format rich-text */
  text: string;
  subtext?: string;
  policy?: {
    text?: string;
    link?: string;
    openInNewTab?: boolean;
  };
  allowTextButton?: string;
}

function CookieConsent(
  { text, subtext, policy, allowTextButton = "Aceitar" }: Props,
) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="font-matria fixed transform-gpu translate-y-[200%] transition duration-300 bottom-[67px] md:bottom-0 z-50 flex justify-center items-center bg-[#FFEE9C] text-gray-950 px-3.5 pt-[34px] md:pt-6 pb-6 border-t border-gray-200 w-full"
      >
        <button
          title="Fechar"
          aria-label="Fechar exibição dos cookies"
          className="absolute top-3 right-3 text-gray-950"
          data-button-cc-close
        >
          <Icon
            id="XMark"
            strokeWidth={0}
            size={20}
          />
        </button>

        <div className="flex flex-col md:flex-row justify-center items-center gap-x-6">
          <div className="flex items-center flex-col">
            <div
              className="text-base font-normal leading-[26px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />

            <div className="flex flex-row justify-start items-start w-full">
              <Show when={!!subtext}>
                <p
                  className="text-base font-normal mr-1 leading-[26px]"
                  dangerouslySetInnerHTML={{ __html: subtext! }}
                />
              </Show>

              <Show when={!!policy?.text}>
                <Show when={!!policy?.link}>
                  <a
                    href={policy?.link}
                    class="block text-base font-normal link text-green-800 leading-[26px]"
                    {...(policy?.openInNewTab && {
                      rel: "noopener noreferrer",
                      target: "_blank",
                    })}
                  >
                    {policy?.text}
                  </a>
                </Show>

                <Hide when={!!policy?.text}>
                  <p class="text-base font-normal link text-green-800 leading-[26px]">
                    {policy?.text}
                  </p>
                </Hide>
              </Show>
            </div>
          </div>

          <button
            title={allowTextButton}
            aria-label={allowTextButton}
            class="btn h-[50px] mt-3 md:mt-0 bg-green-800 hover:bg-green-800 border-green-800 hover:border-green-800 text-white px-3 rounded w-full md:w-[256px]"
            data-button-cc-accept
          >
            <p class="font-normal text-lg leading-4">
              {allowTextButton}
            </p>
          </button>
        </div>
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${script})("${id}");` }}
      />
    </>
  );
}

export default CookieConsent;

const script = (id: string) => {
  const callback = () => {
    const KEY = "store-cookie-consent";
    const ACCEPTED = "accepted";
    const HIDDEN = "translate-y-[200%]";

    const elem = document.getElementById(id);

    if (elem) {
      const consent = localStorage.getItem(KEY);

      if (consent !== ACCEPTED) {
        const accept = elem.querySelector("[data-button-cc-accept]");
        const close = elem.querySelector("[data-button-cc-close]");

        if (accept) {
          accept.addEventListener("click", () => {
            localStorage.setItem(KEY, ACCEPTED);
            elem.classList.add(HIDDEN);
          });
        }

        if (close) {
          close.addEventListener("click", () => {
            elem.classList.add(HIDDEN);
          });
        }

        elem.classList.remove(HIDDEN);
      }
    }
  };

  addEventListener("scroll", callback, { once: true });
};
