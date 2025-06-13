import { AvailableIcons } from "../../components/ui/Icon.tsx";

/**
 * @titleBy title
 */
export interface Card {
  /**
   * @format rich-text
   */
  title: string;
}

export interface Props {
  title?: string;
  cards?: Card[];
}

function FeatureCard({ title }: Card) {
  return (
    <div class=" w-96 h-16 content-center bg-green-800 group group-hover:-translate-y-3 p-3">
      <div class="space-y-4 text-center">
        {title && (
          <div
            class="text-xl font-light font-matria text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
      </div>
    </div>
  );
}

const DEFAULT_CARDS = [
  {
    "icon": "Discount" as AvailableIcons,
    "text": ":)",
    "title": "<p>Visit our coupon page!</p>",
  },
  {
    "icon": "Discount" as AvailableIcons,
    "text": ":)",
    "title": "<p>Visit our coupon page!</p>",
  },
  {
    "icon": "Discount" as AvailableIcons,
    "text": ":)",
    "title": "<p>Visit our coupon page!</p>",
  },
];

export default function Features(
  { title = "Feature", cards = DEFAULT_CARDS }: Props,
) {
  return (
    <section class="relative bg-white text-black py-20 max-w-screen">
      <div class="mx-6 lg:container lg:mx-auto flex justify-center items-center flex-col gap-20">
        {title && (
          <h2 class="font-medium text-[36px] lg:text-[72px] leading-[100%] text-center max-w-4xl z-10">
            {title}
          </h2>
        )}
        <div class="features">
          {cards?.map((card, index) => <FeatureCard key={index} {...card} />)}
        </div>
      </div>
    </section>
  );
}
