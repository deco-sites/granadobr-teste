import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface IntroProps {
  text?: string;
  subheading?: string;
  alignment?: "Left" | "Center" | "Right";
  image?: ImageWidget;
  alt?: string;
}

const ALIGNMENT_TEXT = {
  "Left": "items-start text-start",
  "Center": "items-center text-center",
  "Right": "items-end text-end",
};

export default function Intro({
  text =
    "Lorem ipsum dolor sit amet consectetur. Placerat ornare diam nulla fringilla gravida justo elementum. Ut sed in.",
  subheading,
  alignment = "Left",
  image,
  alt = "Intro image",
}: IntroProps) {
  return (
    <section class="bg-white mx-8">
      <div class="bg-white font-matria text-base font-light mt-5">
        <a
          href="/"
          className="text-[#1D1D1D] font-normal font-matria"
          aria-label="Inicio"
        >
          {"Início"}
        </a>
        <span class="mx-4 text-gray-400">{">"}</span>
        <span class="">{text}</span>
      </div>
      <div class="xl:container xl:mx-auto mx-5 md:mx-10 py-10">
        <div
          class={`flex flex-col gap-6 ${ALIGNMENT_TEXT[alignment ?? "Left"]}`}
        >
          <h1 class="font-granado text-green-800 text-3xl md:text-6xl leading-[120%] font-light">
            {text}
          </h1>
          {subheading && (
            <p class="text-base-content text-[18px]">{subheading}</p>
          )}
        </div>
        {image && (
          <div class="flex justify-center mt-3">
            <Image
              width={720}
              loading="lazy"
              class="max-w-[200px] h-auto object-contain lg:rounded"
              alt={alt}
              height={364}
              src={image}
              fetchPriority="low"
            />
          </div>
        )}
      </div>
    </section>
  );
}
