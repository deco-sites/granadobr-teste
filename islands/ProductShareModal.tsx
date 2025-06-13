import { useId } from "preact/hooks";
import Modal from "site/components/ui/Modal.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useModal } from "site/islands/ModalProvider.tsx";

export interface Props {
  canonical: string;
  shareModalText: string;
}

export interface ShareButtonProps {
  shareButtonText?: string;
}

export function ShareButton(
  { shareButtonText }: ShareButtonProps,
) {
  const { setIsShareModalOpen } = useModal();

  return (
    <button
      onClick={() => setIsShareModalOpen(true)}
      className="flex items-center space-x-2"
      id="pdp-share-button"
    >
      <Icon id="Compartilhar" size={24} strokeWidth={0.1} />
      {shareButtonText && (
        <span className="hidden md:block text-lg font-normal font-matria">
          {shareButtonText}
        </span>
      )}
    </button>
  );
}

export default function ProductShareModal(
  { canonical, shareModalText }: Props,
) {
  const id = useId();
  const extractedPart = canonical.split(":")[1];
  const { isShareModalOpen, setIsShareModalOpen } = useModal();

  return (
    <div id={id}>
      <Modal loading="lazy" open={isShareModalOpen}>
        <div
          className="fixed inset-0 z-50 h-screen bg-gray-600 bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className={`absolute bottom-0 md:bottom-2/3 w-full md:w-fit bg-white rounded-t-lg md:rounded-lg shadow-lg transition duration-300 ease-in-out ${
              !isShareModalOpen
                ? "translate-y-full opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-center p-5">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-lg"
              >
                <Icon id="Close" size={24} strokeWidth={0.1} />
              </button>
            </header>
            <div
              className="pb-[30px] px-10 flex flex-col items-center"
              id="pdp-share-modal"
            >
              <h3 className="text-lg text-center mb-5 font-matria font-normal">
                {shareModalText}
              </h3>
              <ul className="flex space-x-4 w-[280px] justify-center">
                {[
                  {
                    id: "Facebook",
                    url:
                      `https://www.facebook.com/sharer/sharer.php?u=https://${extractedPart}`,
                    size: 24,
                  },
                  {
                    id: "X",
                    url:
                      `https://twitter.com/intent/tweet?url=https://${extractedPart}`,
                    size: 20,
                  },
                  {
                    id: "Message",
                    url:
                      `mailto:?subject=Check%20this%20out&body=https://${extractedPart}`,
                    size: 20,
                  },
                  {
                    id: "WhatsApp",
                    url:
                      `https://api.whatsapp.com/send?text=https://${extractedPart}`,
                    size: 20,
                  },
                ].map((link) => (
                  <li
                    key={link.id}
                    className="flex justify-center items-center w-[50px] h-[50px] border-[1px] border-green-800 rounded-full"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon
                        id={link.id}
                        className="text-green-800 pointer-events-none"
                        size={link.size}
                        strokeWidth={0.1}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
