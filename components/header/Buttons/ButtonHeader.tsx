import Icon from "site/components/ui/Icon.tsx";
import { forwardRef } from "preact/compat";
import type { JSX } from "preact";
import { AvailableIcons } from "site/components/ui/Icon.tsx";

export type Props =
  & Omit<JSX.IntrinsicElements["button"], "loading">
  & {
    loading?: boolean;
    iconId?: AvailableIcons;
    iconSize?: number;
    iconheight?: number;
    iconwidth?: number;
    imgWidth?: number;
    imgHeight?: number;
    iconStrokeWidth?: number;
    label?: string;
    ariaLabel?: string;
    isOpen?: boolean;
    textClassName?: string;
    iconClassName?: string;
    imgSrc?: string;
    imgAlt?: string;
    imgClassName?: string;
    onToggle?: () => void;
  };

const ButtonHeader = forwardRef<HTMLButtonElement, Props>(({
  type = "button",
  className: _className = "",
  loading,
  disabled,
  ariaLabel,
  children,
  iconId,
  iconSize = 20,
  iconheight,
  iconwidth,
  imgWidth,
  imgHeight,
  iconStrokeWidth = 0.01,
  label,
  isOpen,
  textClassName = "",
  iconClassName = "",
  imgSrc,
  imgAlt,
  imgClassName = "",
  onToggle,
  onClick,
  ...props
}, ref) => {
  const iconRotation = isOpen ? "rotate-180" : "rotate-0";

  return (
    <button
      {...props}
      ref={ref}
      className={`flex items-center ${_className}`}
      disabled={disabled || loading}
      aria-label={ariaLabel || props["aria-label"]}
      type={type}
      onClick={onToggle ?? onClick}
    >
      {loading && <span className="loading loading-spinner" />}
      {!loading && iconId && (
        <Icon
          id={iconId}
          width={iconwidth ?? iconSize}
          height={iconheight ?? iconSize}
          strokeWidth={iconStrokeWidth}
          className={`transition-transform duration-300 ${iconRotation} ${iconClassName}`}
        />
      )}
      {!loading && imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt || "Image"}
          className={`inline-block ${imgClassName}`}
          width={imgWidth}
          height={imgHeight}
        />
      )}
      {label && (
        <span className={`whitespace-nowrap uppercase ${textClassName}`}>
          {label}
        </span>
      )}
      {children}
    </button>
  );
});

export default ButtonHeader;
