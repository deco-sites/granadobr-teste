import BaseInstitutionalPage from "../Common/BaseInstitutionalPage.tsx";
import { AccordionItem } from "../Common/Accordion.tsx";

interface Props {
  home: string;
  pageTitle: string;
  pageSubtitle: string;
  rules: AccordionItem[];
}

function PromotionRules({ home, pageTitle, pageSubtitle, rules }: Props) {
  return (
    <BaseInstitutionalPage
      home={home}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      items={rules}
      customStyles={{
        subtitle: "md:text-center",
      }}
    />
  );
}

export default PromotionRules;
