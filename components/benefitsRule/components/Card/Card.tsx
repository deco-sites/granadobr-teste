import Icon from "../../../../components/ui/Icon.tsx";

import Show from "../../../../directives/Show/index.tsx";
import Hide from "../../../../directives/Hide/index.tsx";

import { Props } from "./types.ts";

const Card = ({
  href,
  openInNewTab,
  description,
  icon,
}: Props) => {
  const Content = () => {
    return (
      <div class="flex flex-col items-center">
        <Icon
          id={icon}
          name={icon}
          className="text-green-800"
          strokeWidth={4}
          height={44}
          width={44}
        />

        <Show when={!!description}>
          <div
            class="text-green-950"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </Show>
      </div>
    );
  };

  return (
    <>
      <Show when={!!href?.length}>
        <a
          href={href}
          class="block"
          {...(openInNewTab && {
            rel: "noopener noreferrer",
            target: "_blank",
          })}
          aria-label={description}
        >
          <Content />
        </a>
      </Show>

      <Hide when={!!href?.length}>
        <Content />
      </Hide>
    </>
  );
};

export default Card;
