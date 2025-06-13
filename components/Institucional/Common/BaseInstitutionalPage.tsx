import { FunctionComponent } from "preact";
import Icon from "site/components/ui/Icon.tsx";
import Accordion from "site/islands/Institucional/Accordion.tsx";
import { AccordionItem } from "./Accordion.tsx";

interface BaseProps {
  home?: string;
  homeTitle?: string;
  pageTitle: string;
  pageSubtitle?: string;
  items?: AccordionItem[];
  customStyles?: {
    container?: string;
    classItem?: string;
    icon?: string;
    title?: string;
    subtitle?: string;
  };
}

const BaseInstitutionalPage: FunctionComponent<BaseProps> = (
  { home, homeTitle, pageTitle, pageSubtitle, items, customStyles },
) => {
  return (
    <>
      {home && (
        <nav
          aria-label="Breadcrumb"
          className="text-base font-matria py-4 px-8 md:mb-4"
        >
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a
                href="/"
                className="text-[#1D1D1D] font-normal font-matria"
                aria-label="Inicio"
              >
                {home}
              </a>
              <span className="mx-2">
                <Icon
                  id="ChevronUp"
                  strokeWidth={0.01}
                  className="font-normal text-green-800 h-[16px] w-[16px] rotate-90"
                />
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-[#1D1D1D] font-normal font-matria">
                {homeTitle ?? pageTitle}
              </span>
            </li>
          </ol>
        </nav>
      )}
      <div className="flex flex-col items-center pb-5 md:pb-10">
        <div className="text-center p-2 md:p-4">
          <p className="font-granado text-[36px] md:text-[40px] text-green-800 font-medium">
            {pageTitle}
          </p>
        </div>
        {pageSubtitle && (
          <div
            className={`w-full text-left px-8 md:px-0 md:w-[824px] ${customStyles?.subtitle}`}
          >
            <div
              className="font-normal text-[16px] font-matria [&_a]:text-green-800 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: pageSubtitle }}
            />
          </div>
        )}
        {items && (
          <div
            className={`w-full flex justify-center ${customStyles?.classItem}`}
          >
            <Accordion items={items} />
          </div>
        )}
      </div>
    </>
  );
};

export default BaseInstitutionalPage;
