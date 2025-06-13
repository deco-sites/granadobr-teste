import { Logo } from "./components/Logo/types.ts";
import { Social } from "./components/Social/types.ts";

import { Payment } from "./components/PaymentMethods/types.ts";
import { Section } from "./components/SectionsLinks/types.ts";

import { Newsletter } from "./components/Newsletter/types.ts";
import { SwitcherItem } from "./components/SwitcherStore/types.ts";

import { Info } from "./components/Info/types.ts";
import { Notice } from "./components/Notice/types.ts";

export interface Props {
  logo?: Logo;
  switcherStore?: SwitcherItem[];
  newsletter?: Newsletter;
  highlights?: {
    type: "Storefront" | "WhatsApp";
    label: string;
    description: string;
    href: string;
    openInNewTab?: boolean;
  }[];
  sections?: Section[];
  social?: Social;
  payments?: Payment;
  info?: Info[];
  notice?: Notice[];
  hide?: {
    logo?: boolean;
    newsletter?: boolean;
    sectionLinks?: boolean;
    paymentMethods?: boolean;
    switcherStore?: boolean;
    socialLinks?: boolean;
    highlights?: boolean;
    notice?: boolean;
    info?: boolean;
  };
}
