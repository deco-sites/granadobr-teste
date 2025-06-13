import type { ImageWidget } from "apps/admin/widgets.ts";

export interface ServiceProps {
  type?: string;
  label?: string;
  /** @format rich-text */
  description?: string;
  image: ImageWidget;
  placement: "left" | "right";
}

export interface Props {
  services?: ServiceProps[];
}

export default function Services({
  services = [
    {
      type: "Service",
      label: "Your Title Here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam id tincidunt dapibus, elit arcu ultricies massa, quis ornare nisl libero vitae urna.",
      image:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/3290/488e5dc5-9a24-48c9-9795-09b97394fb5f",
      placement: "left",
    },
  ],
}: Props) {
  return (
    <div class="bg-base-100 flex flex-col pb-14 font-matria">
      {services?.map((service, index) => (
        <div
          key={index}
          class={`flex xl:container px-0 md:px-20 xl:mx-auto first:pt-0 pb-12 pt-4 md:pt-12 mx-5 md:mx-10 flex-col items-center lg:flex-row ${
            service.placement === "right"
              ? "lg:flex-row-reverse"
              : "lg:flex-row"
          } gap-2 justify-evenly ${
            index % 2 === 1 ? "bg-green-600 px-4 min-h-[430px]" : "bg-base-100"
          }`}
        >
          <div class="w-11/12 lg:w-1/3 flex justify-center lg:justify-center order-1 lg:order-1 self-center">
            <img
              class="w-full lg:w-auto rounded-xl object-cover"
              sizes="(max-width: 640px)"
              src={service.image}
              alt={service.label}
              decoding="async"
              loading="lazy"
            />
          </div>
          <div class="w-full md:w-3/4 flex flex-col items-center lg:items-start text-left order-2 lg:order-2">
            {service.type && <p class="text-sm text-gray-500">{service.type}
            </p>}
            <p
              class={`font-granado text-green-800 text-4xl mb-4 ${
                index % 2 === 1 ? "text-white" : ""
              }`}
            >
              {service.label}
            </p>
            <div
              class={`text-left text-base mt-4 pr-3 ${
                index % 2 === 1 ? "text-white" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: service.description || "" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
