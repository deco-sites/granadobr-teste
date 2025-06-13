import Image from "apps/website/components/Image.tsx";
import { clx } from "../../../sdk/clx.ts";
import { Logo } from "../Header.tsx";

export interface Props {
  logo: {
    whiteBackground?: Logo;
    TransparentBackground?: Logo;
  };
}

function LogoComponent({
  alt,
  src,
  width,
  height,
  className,
}: Logo & { className?: string }) {
  return (
    <a
      href="/"
      aria-label="Granado logo"
      className={clx(
        "flex items-center justify-center max-w-[137.14px] 2xl:max-w-[160px] max-h-[60px] 2xl:max-h-[70px]",
        className,
      )}
    >
      <Image
        loading="lazy"
        fetchPriority="low"
        src={src}
        alt={alt}
        width={width || 160}
        height={height || 70}
      />
    </a>
  );
}

function HeaderLogo({ logo }: Props) {
  const { whiteBackground, TransparentBackground } = logo;

  return (
    <>
      {whiteBackground && (
        <LogoComponent
          {...whiteBackground}
          className="group-data-[background=white]/bg-provider:block group-data-[background=transparent]/bg-provider:hidden"
        />
      )}
      {TransparentBackground && (
        <LogoComponent
          {...TransparentBackground}
          className="group-data-[background=transparent]/bg-provider:block group-data-[background=white]/bg-provider:hidden"
        />
      )}
    </>
  );
}

export default HeaderLogo;
