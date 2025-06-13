import {
  loader as defaultLoader,
  Props as DefaultProps,
} from "apps/commerce/sections/Seo/SeoPDPV2.tsx";
import { AppContext } from "site/apps/site.ts";
export {
  default,
  LoadingFallback,
  Preview,
} from "apps/commerce/sections/Seo/SeoPDPV2.tsx";
import { clearCanonical } from "./SeoPLPV2Custom.tsx";

export interface Props extends DefaultProps {
  removeQueryParamsFromCanonical?: boolean;
}

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
