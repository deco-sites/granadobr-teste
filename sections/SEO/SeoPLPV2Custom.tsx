import {
  loader as defaultLoader,
  Props as DefaultProps,
} from "apps/commerce/sections/Seo/SeoPLPV2.tsx";
import { AppContext } from "site/apps/site.ts";
export {
  default,
  LoadingFallback,
  Preview,
} from "apps/commerce/sections/Seo/SeoPLPV2.tsx";

export interface Props extends DefaultProps {
  removeQueryParamsFromCanonical?: boolean;
}

export const clearCanonical = (canonical: string) => {
  if (!canonical) return canonical;

  const newCanonical = new URL(canonical);

  const page = newCanonical.searchParams.get("p");

  newCanonical.search = "";

  if (page) {
    newCanonical.searchParams.set("p", page);
  }

  return newCanonical.href;
};

export const hasFilter = (url: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.delete("p");
  newUrl.searchParams.delete("sort");

  return newUrl.searchParams.toString() !== "";
};

export const loader = (
  _props: Props,
  req: Request,
  ctx: AppContext,
) => {
  const { jsonLD } = _props;

  const { seo } = jsonLD ?? {};

  const newSeo = seo
    ? {
      ...seo,
      canonical: clearCanonical(seo.canonical),
      noIndexing: seo.noIndexing || hasFilter(req.url),
    }
    : null;

  const newJsonLD = jsonLD
    ? {
      ...jsonLD,
      seo: newSeo,
    }
    : null;

  const props = {
    ..._props,
    jsonLD: newJsonLD,
  };

  const propsFromDefaultLoader = defaultLoader(props, req, ctx);

  return propsFromDefaultLoader;
};
