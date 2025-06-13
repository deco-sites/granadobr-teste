import { useId } from "preact/compat";
import Icon from "../../components/ui/Icon.tsx";

export interface Props {
  phone?: number;
  message?: string;
  whatsAppMessage?: string;
}

const handleClose = (id: string) => {
  const CLOSE = "hidden";
  const KEY = "store-whatsapp-hidden";

  const element = document.getElementById(id);
  if (element) {
    const close = element.querySelector("[data-button-cc-close]");

    document.addEventListener("DOMContentLoaded", () => {
      localStorage.setItem(KEY, "false");

      document.addEventListener("scroll", () => {
        if (globalThis.scrollY > 150) {
          const openWhatsApp = localStorage.getItem(KEY);
          if (!openWhatsApp || openWhatsApp === "false") {
            element.classList.remove(CLOSE);
            if (close) {
              close.addEventListener("click", () => {
                element.classList.add(CLOSE);
                localStorage.setItem(KEY, "true");
              });
            }
          } else {
            element.classList.add(CLOSE);
          }
        }
      });
    });
  }
};

function WhatsApp(
  { phone, message = "Fale conosco!", whatsAppMessage = "Olá!" }: Props,
) {
  if (!phone) return null;

  const formattedPhone = phone?.toString().replace(/\D/g, "");
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="fixed bottom-32 md:bottom-7 right-4 md:right-8 z-40 hidden"
      >
        <div
          class="bg-white border border-gray-300 text-black py-2 px-2.5  rounded-lg shadow-lg flex items-center relative"
          aria-label="Chat on WhatsApp"
        >
          <a
            href={`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${
              encodeURIComponent(whatsAppMessage)
            }&type=phone_number&app_absent=0`}
            aria-label="Chat on WhatsApp"
            class="flex items-center"
            target="_blank"
          >
            <Icon
              id="FaleConosco"
              size={36}
              stroke="1"
              className="text-black"
              preserveAspectRatio="xMidYMid meet"
            />
            <span class="ml-2 text-[13px] text-black font-normal font-matria">
              {message}
            </span>
          </a>
          <button
            class="absolute top-[-10px] right-[-10px] bg-white border border-gray-300 rounded-full p-1 shadow-lg"
            aria-label="Close"
            data-button-cc-close
          >
            <Icon
              id="Close"
              size={13}
              stroke="0.01"
              className="text-black"
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </div>
      </div>

      <script
        defer
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${handleClose})("${id}");` }}
      />
    </>
  );
}

export default WhatsApp;
