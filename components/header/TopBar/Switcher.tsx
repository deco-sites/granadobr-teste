import Icon from "site/components/ui/Icon.tsx";

const commonClasses =
  "flex items-center justify-center px-3 xl:px-5 p-2.5 h-9 w-full leading-[15px]";
const commonIconProps = ``;

function Switcher({ openInNewTab = false }) {
  const targetProps = {
    rel: openInNewTab ? "noopener noreferrer" : "noreferrer",
    target: openInNewTab ? "_blank" : "_self",
  };

  return (
    <ul
      className="flex items-center justify-center h-full overflow-hidden text-white"
      id="switcher-store"
    >
      <li className={`${commonClasses} md:bg-green-950 bg-green-800 `}>
        <a
          href="https://www.granado.com.br/"
          {...targetProps}
          title="Granado"
          aria-label="Granado"
          rel="noopener noreferrer"
        >
          <Icon
            id="Granado"
            alt="Granado"
            className={`h-[78px] w-[78px] xl:h-[72px] xl:w-[72px] ${commonIconProps}`}
          />
        </a>
      </li>
      <li
        className={`${commonClasses} md:bg-green-800 bg-green-950 hover:opacity-90 `}
      >
        <a
          href="https://www.phebo.com.br/phebo/?utm_source=home&utm_medium=phebo&utm_campaign=header"
          {...targetProps}
          title="Phebo"
          aria-label="Phebo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            id="Phebo"
            alt="Phebo"
            className={`h-[60px] w-[60px] xl:h-[72px] xl:w-[72px]  ${commonIconProps}`}
          />
        </a>
      </li>
      <li
        className={`${commonClasses} md:bg-green-800 bg-green-950 hover:opacity-90 `}
      >
        <a
          href="https://carenb.com/?utm_source=home&amp;utm_medium=granado&amp;utm_campaign=header"
          {...targetProps}
          title="Care"
          aria-label="Care"
          target="_blank"
          rel="noopener noreferrer"
        >
          {
            /* <Icon
            id="Care"
            alt="Care"
            className={`h-[60px] w-[60px] xl:h-[72px] xl:w-[72px]  ${commonIconProps}`}
          /> */
          }
          <img
            src="/image/logos/care.webp"
            alt="Care"
            width={60}
            height={60}
          />
        </a>
      </li>
    </ul>
  );
}

export default Switcher;
