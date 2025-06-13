import BaseInstitutionalPage from "../Common/BaseInstitutionalPage.tsx";
import { AccordionItem } from "../Common/Accordion.tsx";

interface Props {
  home: string;
  pageTitle: string;
  /**
   * @title Content
   * @format rich-text
   * @description Page content
   */
  pageSubtitle: string;
  policies: AccordionItem[];
}

function ExchangePolicy({ home, pageTitle, pageSubtitle, policies }: Props) {
  return (
    <BaseInstitutionalPage
      home={home}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      items={policies}
    />
  );
}

export default ExchangePolicy;
