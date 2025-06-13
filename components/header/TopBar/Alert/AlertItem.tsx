import { AlertProps } from "site/components/header/Header.tsx";

export interface Props {
  alert: AlertProps;
  id: string;
  className: string;
}

function AlertItem({ alert, id, className }: Props) {
  const Element = alert.url ? "a" : "div";
  const ariaLabel = `Alert: ${alert.message}`;
  const commonProps = {
    id: `${id}-${alert.url ? "link" : "div"}`,
    className:
      `relative overflow-hidden flex items-center justify-center ${className}`,
    "aria-label": ariaLabel,
  };

  return (
    <Element
      {...commonProps}
      {...(alert.url && { href: alert.url })}
    >
      <span className="text-white text-sm leading-[15px] font-matria text-center ">
        {alert.message}
      </span>
    </Element>
  );
}

export default AlertItem;