import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";
import { memo } from "preact/compat";

type Country = {
  name: string;
  code: AvailableIcons;
  url: string;
};

type CountryItemProps = {
  country: Country;
};

const CountryItem = memo(({ country }: CountryItemProps) => (
  <li className="hover:bg-gray-100 cursor-pointer w-44 h-8">
    <a
      href={country.url}
      rel="noopener noreferrer"
      className="flex  py-2 px-4 w-full h-full"
    >
      <Icon
        id={country.code}
        strokeWidth={0.1}
        width={30}
        height={20}
        className={`inline-flex mr-2`}
      />
      <span className="text-xs font-normal text-black tk-mr-eaves-xl-sans">
        {country.name}
      </span>
    </a>
  </li>
));

function LanguageSelectorItems() {
  const countries: Country[] = [
    {
      name: "United States",
      code: "FlagUsa",
      url: "https://www.granado.com.br/usa",
    },
    {
      name: "United Kingdom",
      code: "FlagUk",
      url: "https://www.granado.com.br/uk",
    },
    {
      name: "France",
      code: "FlagFr",
      url: "https://www.granado.eu/fr/",
    },
    {
      name: "EU - English",
      code: "FlagEn",
      url: "https://www.granado.eu/en/",
    },
    {
      name: "Portugal",
      code: "FlagPt",
      url: "https://www.granado.eu/pt/",
    },
  ];

  return (
    <div className="absolute inline-block text-left">
      <div className="absolute mt-6 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 md:origin-top-right md:-right-24">
        <div className="absolute top-0.5 -translate-x-1/2 -mt-2 left-1/4 md:left-3/4">
          <div className="bg-white rotate-45 transform origin-bottom-left -translate-y-1/2 border-t border-l h-3 w-3">
          </div>
        </div>
        <ul
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {countries.map((country) => (
            <CountryItem key={country.code} country={country} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LanguageSelectorItems;
