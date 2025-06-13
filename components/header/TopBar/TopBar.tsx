import { AlertProps } from "site/components/header/Header.tsx";
import { useEffect, useState } from "preact/compat";
import Switcher from "site/components/header/TopBar/Switcher.tsx";
import Alert from "site/components/header/TopBar/Alert/Alert.tsx";
import { debounce } from "std/async/debounce.ts";

export interface Props {
  alerts?: AlertProps[];
  interval?: number;
  device: string;
  hideSwitcher?: boolean;
}

function TopBar({ alerts, interval, device, hideSwitcher }: Props) {
  const [leftOffset, setLeftOffset] = useState("32px");

  useEffect(() => {
    if (device === "mobile") {
      return;
    }

    const updateOffset = debounce(() => {
      if (device === "mobile") {
        return;
      }
      const newOffset = globalThis.innerWidth > 1920
        ? `calc(max(32px, 50vw - 930px))`
        : "32px";
      setLeftOffset(newOffset);
    }, 500);

    globalThis.addEventListener("resize", updateOffset);
    updateOffset();

    return () => globalThis.removeEventListener("resize", updateOffset);
  }, [device]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center pb-2.5 md:py-2.5 md:px-8 bg-green-800 relative">
      {!hideSwitcher && (
        <div
          className="md:absolute w-full md:w-auto h-full mb-2.5 md:m-0 md:top-0 block box-border"
          style={{ left: device === "mobile" ? "0" : leftOffset }}
        >
          <Switcher />
        </div>
      )}
      <div className="flex justify-center items-center desk:px-8 mobile:min-h-[30px]">
        {alerts && alerts.length > 0 && (
          <Alert alerts={alerts} interval={interval} />
        )}
      </div>
    </div>
  );
}

export default TopBar;