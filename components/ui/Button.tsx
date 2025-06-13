import { forwardRef } from "preact/compat";
import type { JSX } from "preact";

export type Props =
  & Omit<JSX.IntrinsicElements["button"], "loading">
  & {
    loading?: boolean;
    ariaLabel?: string;
    classLoading?: string;
  };

const Button = forwardRef<HTMLButtonElement, Props>(({
  loading,
  disabled,
  type = "button",
  class: _class = "",
  classLoading,
  ariaLabel,
  children,
  ...props
}, ref) => (
  <button
    {...props}
    disabled={disabled || loading}
    class={`btn no-animation ${_class} ${loading ? classLoading : ""}`}
    aria-label={ariaLabel || props["aria-label"]}
    type={type}
    ref={ref}
  >
    {loading ? <span class="loading loading-spinner" /> : children}
  </button>
));

export default Button;
