import Image from "apps/website/components/Image.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const Logo = ({ content }: Props) => {
  return (
    <Show when={!!content?.image}>
      <div class="flex justify-center mt-11 md:mt-14 lg:mt-2 w-full md:w-auto">
        <Image
          width={172}
          loading="lazy"
          fetchPriority="low"
          class="object-cover rounded max-h-[43px]"
          alt={content?.alt || "Logotipo do site"}
          src={content?.image!}
          height={43}
        />
      </div>
    </Show>
  );
};

export default Logo;
