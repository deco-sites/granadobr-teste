import { useScript } from "@deco/deco/hooks";

export interface Props {
  pageType:
    | "home"
    | "category or search"
    | "product"
    | "category"
    | "searchresults";
}

export default function PageView({ pageType }: Props) {
  return (
    <script
      type="module"
      defer
      dangerouslySetInnerHTML={{
        __html: useScript((pageType: string) => {
          globalThis.window.dataLayer.push({
            pageType,
            pageName: document.title,
          });
        }, pageType),
      }}
    />
  );
}
