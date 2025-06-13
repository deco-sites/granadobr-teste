import BaseInstitutionalPage from "../Common/BaseInstitutionalPage.tsx";
import { AccordionItem } from "../Common/Accordion.tsx";

interface Props {
  home: string;
  homeTitle: string;
  pickupInStoreTitle: string;
  expressDeliveryTitle: string;

  /**
   * @title pickupInStorePolicies
   * @format rich-text
   * @description Page content
   */
  pickupInStorePolicies: AccordionItem[];
  /**
   * @title expressDeliveryPolicies
   * @format rich-text
   * @description Page content
   */
  expressDeliveryPolicies: AccordionItem[];
}

function pickupInStoreAndExpressDelivery(
  {
    home,
    pickupInStoreTitle,
    expressDeliveryTitle,
    pickupInStorePolicies,
    expressDeliveryPolicies,
    homeTitle,
  }: Props,
) {
  return (
    <>
      <BaseInstitutionalPage
        home={home}
        homeTitle={homeTitle}
        pageTitle={pickupInStoreTitle}
        items={pickupInStorePolicies}
      />
      <BaseInstitutionalPage
        pageTitle={expressDeliveryTitle}
        items={expressDeliveryPolicies}
      />
    </>
  );
}

export default pickupInStoreAndExpressDelivery;
