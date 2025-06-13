import Notice from "./components/Notice/index.tsx";
import SectionsLinks from "./components/SectionsLinks/index.tsx";

import Social from "./components/Social/index.tsx";
import SwitcherStore from "./components/SwitcherStore/index.tsx";

import Info from "./components/Info/index.tsx";
import PaymentMethods from "./components/PaymentMethods/index.tsx";

import Logo from "./components/Logo/index.tsx";
import Highlights from "./components/Highlights/index.tsx";

import Newsletter from "../../islands/Newsletter.tsx";

import { Props } from "./types.ts";

const Footer = ({
  logo,
  switcherStore,
  newsletter = {
    title: "Newsletter",
  },
  sections = [
    {
      label: "Institucional",
      items: [
        {
          href: "/nossa-historia",
          label: "Nossa história",
        },
        {
          href: "https://granado.gupy.io/",
          label: "Trabalhe conosco",
        },
      ],
    },
    {
      label: "Atendimento",
      items: [
        {
          href: "https://suporte.granado.com.br/hc/pt-br",
          label: "Ajuda e contato",
        },
        {
          href: "/politica-de-troca",
          label: "Política de troca",
        },
      ],
    },
  ],
  social = {
    title: "Redes sociais",
    items: [
      {
        label: "Facebook",
        link: "https://www.facebook.com/GranadoPharmacias1870/",
      },
      {
        label: "Instagram",
        link: "https://www.instagram.com/granadopharmacias/",
      },
    ],
  },
  payments = {
    title: "Formas de pagamento",
    items: [{ label: "Pix" }, { label: "Mastercard" }, { label: "Visa" }],
  },
  hide = {
    logo: false,
    notice: false,
    newsletter: false,
    paymentMethods: false,
    switcherStore: false,
    sectionLinks: false,
    socialLinks: false,
    highlights: false,
    info: false,
  },
  highlights,
  notice,
  info,
}: Props) => {
  const components = {
    logo: <Logo content={logo} />,
    notice: <Notice content={notice} />,
    switcherStore: <SwitcherStore content={switcherStore} />,
    paymentMethods: <PaymentMethods content={payments} />,
    sectionLinks: <SectionsLinks content={sections} />,
    highlights: <Highlights content={highlights} />,
    socialLinks: <Social content={social} />,
    info: <Info content={info} />,
    newsletter: <Newsletter content={newsletter} />,
  };

  const arrInvisible = Object.keys(hide).filter(
    (key) => hide[key as keyof typeof hide],
  );

  const renderedElements = Object.keys(components).reduce(
    (acc: { [key: string]: React.ReactNode }, key) => {
      if (arrInvisible.includes(key)) {
        acc[key] = <></>;
      } else {
        acc[key] = components[key as keyof typeof components];
      }

      return acc;
    },
    {},
  );

  return (
    <footer class="flex flex-col pb-[120px] md:pb-9 lg:pb-16 bg-green-800 w-full font-matria">
      {renderedElements["switcherStore"]}

      <div class="flex flex-col md:px-4 lg:px-8 xl:container">
        {renderedElements["newsletter"]}
        {renderedElements["highlights"]}

        <div class="flex flex-col lg:gap-12 md:mt-8 lg:mt-16 max-w-screen-xl mx-auto w-full">
          <div class="flex flex-col md:flex-wrap lg:flex-nowrap md:flex-row md:justify-around">
            {renderedElements["sectionLinks"]}
            {renderedElements["socialLinks"]}
            {renderedElements["logo"]}
          </div>

          {renderedElements["paymentMethods"]}

          <div class="flex flex-col gap-6 lg:gap-8 mt-10 lg:mt-0 md:text-center">
            {renderedElements["info"]} {renderedElements["notice"]}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
