import Icon from "site/components/ui/Icon.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { AccordionItem } from "site/components/Institucional/Common/Accordion.tsx";
import Accordion from "site/islands/Institucional/Accordion.tsx";

interface ImageBanner {
  desktop: ImageWidget;
  mobile: ImageWidget;
  alt?: string;
  lcp?: boolean;
  href: string;
}

interface CardItem {
  image: ImageWidget;
  alt?: string;
  title: string;
  /**
   * @title Text
   * @format rich-text
   */
  text: string;
}

interface BenefitsItem {
  image: ImageWidget;
  alt?: string;
  text: string;
}

interface StatusCardItem {
  image: ImageWidget;
  title: string;
  description: string;
  button: ImageWidget;
  href: string;
}

interface TextCard {
  title: string;
  description: string;
  button: ImageWidget;
  href: string;
}

interface Props {
  home: string;
  homeTitle: string;
  images: ImageBanner;
  cards: CardItem[];
  benefits: {
    title: string;
    info: BenefitsItem[];
  };
  status: {
    imageCards: StatusCardItem[];
    gif: string | ImageWidget;
    gifHref?: string;
    textCard: TextCard;
  };
  frequentlyAskedQuestions: {
    title: string;
    faqItem: AccordionItem[];
  };
}

function Nav({ home, homeTitle }: { home: string; homeTitle: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden md:block text-base font-matria py-4 px-8 md:mb-4"
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
            {homeTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function BannerCard({
  desktop,
  mobile,
  lcp,
  alt,
}: {
  desktop: ImageWidget;
  mobile: ImageWidget;
  lcp?: boolean;
  alt?: string;
}) {
  return (
    <Picture loading="lazy">
      <Source
        media="(max-width: 767px)"
        srcSet={`${mobile} 1x, ${mobile}@2x 2x`}
        sizes="100vw"
        src={mobile}
        width={693}
        height={1200}
        type="image/webp"
      />
      <Source
        media="(min-width: 768px)"
        srcSet={`${desktop} 1x, ${desktop}@2x 2x`}
        sizes="100vw"
        src={desktop}
        width={1920}
        height={665}
        type="image/webp"
      />
      <img
        className="object-cover w-full h-full md:h-fit"
        loading={lcp ? "eager" : "lazy"}
        src={desktop}
        alt={alt}
      />
    </Picture>
  );
}

function Card({ card }: { card: CardItem }) {
  return (
    <div className="relative mt-16 w-full mx-3.5 md:mx-2.5 md:w-64 border border-green-800 p-4 pt-0 flex flex-col items-center text-center">
      <div className="flex justify-center items-center h-[70px] w-full">
        <img
          src={card.image}
          alt={card.alt}
          className="w-[120px] h-[120px] md:w-[139px] md:h-[139px] absolute -top-[70px]"
        />
      </div>
      <div class="font-matria">
        <h3 className="font-matria font-medium text-xl text-green-800 my-4">
          {card.title}
        </h3>
        <p
          dangerouslySetInnerHTML={{ __html: card.text }}
          className="font-matria font-normal text-[17px] text-[#1D1D1D]"
        />
      </div>
    </div>
  );
}

function Benefit({ benefit }: { benefit: BenefitsItem }) {
  return (
    <div className="flex items-center space-x-4 pt-4">
      <div className="flex items-center justify-center w-[120px] h-[120px] md:w-[139px] md:h-[139px]">
        <img
          src={benefit.image}
          alt={benefit.alt}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 flex items-center">
        <p className="text-[#1D1D1D] font-normal font-matria text-[18px] leading-[22.5px] md:leading-[25.71px]">
          {benefit.text}
        </p>
      </div>
    </div>
  );
}

function GifComponent(
  { gif, href }: { gif: string | ImageWidget; href: string },
) {
  return (
    <div className="flex justify-center my-8 w-[593px] overflow-hidden">
      <a href={href} aria-label="gif">
        <img src={gif} alt="GIF" className="w-full max-w-[543px] h-auto" />
      </a>
    </div>
  );
}

function TextWithButtonComponent({
  title,
  description,
  button,
  href,
}: {
  title: string;
  description: string;
  button: ImageWidget;
  href: string;
}) {
  return (
    <div className="flex justify-center text-center my-8 w-[593px] overflow-hidden">
      <div className="flex flex-col w-[280px] items-center text-center">
        <h2 className="font-matria font-medium text-green-800 text-[21px] mb-4">
          {title}
        </h2>
        <p className="text-[#1D1D1D] font-normal font-matria text-[18px] leading-[22.5px] md:leading-[25.71px] mb-4">
          {description}
        </p>
        <a href={href} aria-label="click">
          <img
            src={button}
            alt="button"
            className="w-[151px] h-[43px] object-contain"
          />
        </a>
      </div>
    </div>
  );
}

function StatusCard(
  { image, title, description, button, href }: StatusCardItem,
) {
  return (
    <div className="w-[593px] overflow-hidden shadow-lg">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4 flex-col justify-center text-center bg-green-800">
        <div className="text-white mb-2 font-medium font-matria text-xl">
          {title}
        </div>
        <p className="text-white font-normal font-matria text-lg">
          {description}
        </p>
        <div className="px-6 pt-4 pb-2 flex justify-center">
          <a href={href} aria-label="click">
            <img
              src={button}
              alt="button"
              className="w-[151px] h-[43px] object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function Status(
  { cards, gif, gifHref, textCard }: {
    cards: StatusCardItem[];
    gif: string | ImageWidget;
    gifHref?: string;
    textCard: TextCard;
  },
) {
  return (
    <div className="mx-3.5 grid grid-cols-1 grid-ro justify-center gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((card, index) => <StatusCard key={index} {...card} />)}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4">
        <GifComponent gif={gif} href={gifHref ?? "#"} />
        <TextWithButtonComponent
          title={textCard.title}
          description={textCard.description}
          button={textCard.button}
          href={textCard.href}
        />
      </div>
    </div>
  );
}

function GiftCard({
  home,
  homeTitle,
  images,
  cards,
  benefits,
  status,
  frequentlyAskedQuestions,
}: Props) {
  return (
    <div className="pb-10">
      <Nav home={home} homeTitle={homeTitle} />
      <div className="mb-16">
        {images.href
          ? (
            <a href={images.href} aria-label="banner-img">
              <BannerCard
                desktop={images.desktop}
                mobile={images.mobile}
                lcp={images.lcp}
                alt={images.alt}
              />
            </a>
          )
          : (
            <BannerCard
              desktop={images.desktop}
              mobile={images.mobile}
              lcp={images.lcp}
              alt={images.alt}
            />
          )}
      </div>
      <div className="flex flex-wrap justify-center gap-y-4">
        {cards.map((card, index) => <Card key={index} card={card} />)}
      </div>
      <div className="my-8 mx-7 text-center">
        <h2 className="font-granado font-medium text-green-800 text-[40px] leading-[44px] mb-4">
          {benefits.title}
        </h2>
        <div className="grid mx-6 justify-center">
          {benefits.info.map((benefit, index) => (
            <Benefit key={index} benefit={benefit} />
          ))}
        </div>
      </div>
      <div>
        <Status
          cards={status.imageCards}
          gif={status.gif}
          gifHref={status.gifHref}
          textCard={status.textCard}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-granado font-medium text-[40px] text-green-800">
          {frequentlyAskedQuestions.title}
        </div>
        <Accordion items={frequentlyAskedQuestions.faqItem} />
      </div>
    </div>
  );
}

export default GiftCard;
