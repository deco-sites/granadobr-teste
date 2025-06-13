import Image from "apps/website/components/Image.tsx";

import Icon from "../../../ui/Icon.tsx";
import Button from "../../../ui/Button.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { Props } from "./types.ts";

const Post = (
  {
    href,
    label,
    image,
    categories,
    button = "Leia mais",
    description,
    author,
    date,
    alt,
  }: Props,
) => {
  return (
    <article class="flex flex-col border border-gray-200 rounded p-3 md:p-6 h-full w-full">
      <div class="relative">
        <div class="skeleton bg-gray-200 w-full rounded pt-[66.66%]" />

        <Show when={!!href}>
          <a href={href} aria-label={label} class="absolute inset-0">
            <figure>
              {image && <Image
                src={image}
                class="w-full object-cover rounded aspect-[270/180]"
                loading="lazy"
                fetchPriority="low"
                height={180}
                width={270}
                alt={alt}
              />}
            </figure>
          </a>
        </Show>

        <Hide when={!!href}>
          <figure class="absolute inset-0">
            {image && <Image
              width={270}
              src={image}
              class="w-full object-cover rounded"
              loading="lazy"
              fetchPriority="low"
              height={180}
              alt={alt}
            />}
          </figure>
        </Hide>
      </div>

      <div class="flex flex-col flex-grow gap-2 mt-4 text-gray-950">
        <Show when={!!categories?.length}>
          <ul class="flex justify-start items-center mb-1 gap-1 flex-wrap">
            {categories?.map((category, index) => (
              <li
                key={index}
                class="leading-3 [&:not(:first-of-type)]:last-of-type:before:content-['|'] [&:not(:first-of-type)]:last-of-type:before:mr-1"
              >
                <a
                  href={category.href}
                  aria-label={category.label}
                  class="text-xs leading-3 hover:underline"
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </Show>

        <Show when={!!label}>
          <Show when={!!href}>
            <a href={href} aria-label={label}>
              <h3 class="m-0 text-xl leading-[26px] font-normal">
                {label}
              </h3>
            </a>
          </Show>

          <Hide when={!!href}>
            <h3 class="m-0 text-xl leading-[26px] font-normal">
              {label}
            </h3>
          </Hide>
        </Show>

        <Show when={!!description}>
          <Show when={!!href}>
            <a href={href} aria-label={label}>
              <p class="text-[13px] mb-2 line-clamp-3">
                {description}
              </p>
            </a>
          </Show>

          <Hide when={!!href}>
            <p class="text-[13px] mb-2 line-clamp-3">
              {description}
            </p>
          </Hide>
        </Show>

        <div class="flex justify-start text-xs mt-auto">
          <Show when={!!author}>
            <span>{author}</span>
          </Show>

          <Show when={!!date}>
            <span>{date}</span>
          </Show>
        </div>

        <Show when={!!href}>
          <a href={href} aria-label={label}>
            <Button class="px-0 md:px-8 py-3 gap-1.5 font-normal text-[17px] md:text-lg !leading-none border-green-800 hover:border-green-800 text-green-800 hover:text-white bg-white hover:bg-green-800 disabled:border-[#30303033] rounded w-full md:w-fit min-h-11 h-11">
              {button}
              <Icon id="ChevronRight" size={12} strokeWidth={2} />
            </Button>
          </a>
        </Show>
      </div>
    </article>
  );
};

export default Post;
