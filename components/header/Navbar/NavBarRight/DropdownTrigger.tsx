import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";
import { useId } from "../../../../sdk/useId.ts";
import { clx } from "../../../../sdk/clx.ts";

export interface Props {
  className: string;
  icon: {
    id: string;
    ariaLabel: string;
    width: number;
    height: number;
    className: string;
    label: string;
    iconClassName: string;
    textClassName: string;
  };
  children: React.ReactNode;
}

function Button(
  { icon, className, htmlFor, text, ariaLabel }: {
    icon: {
      id: AvailableIcons;
      width: number;
      height: number;
      className?: string;
    };
    className?: string;
    htmlFor: string;
    text?: {
      content?: string;
      className?: string;
    };
    ariaLabel?: string;
  },
) {
  return (
    <label
      htmlFor={htmlFor}
      aria-label={ariaLabel}
      className={clx("flex items-center cursor-pointer", className)}
    >
      <Icon
        id={icon.id}
        width={icon.width}
        height={icon.height}
        strokeWidth={0.01}
        class={clx("transition-transform duration-300", icon.className)}
      />
      {text && (
        <span className={clx("whitespace-nowrap uppercase", text.className)}>
          {text.content}
        </span>
      )}
    </label>
  );
}

const DropdownTrigger: React.FC<Props> = ({ className, icon, children }) => {
  const id = useId();
  return (
    <div className={className}>
      <input id={id} type="checkbox" class="hidden peer" />
      <Button
        icon={{
          id: icon.id as AvailableIcons,
          width: icon.width,
          height: icon.height,
          className: icon.className,
        }}
        htmlFor={id}
        text={{
          content: icon.label,
          className: icon.textClassName,
        }}
        ariaLabel={icon.ariaLabel}
        className={icon.className}
      />
      <div class="peer-checked:block hidden">{children}</div>
    </div>
  );
};

export default DropdownTrigger;
