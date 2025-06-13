import commerce, { Props as CommerceProps } from "apps/commerce/mod.ts";
import { color as shopify } from "apps/shopify/mod.ts";
import { color as vnda } from "apps/vnda/mod.ts";
import { color as vtex } from "apps/vtex/mod.ts";
import { color as wake } from "apps/wake/mod.ts";
import { color as linx } from "apps/linx/mod.ts";
import { color as nuvemshop } from "apps/nuvemshop/mod.ts";
import { rgb24 } from "std/fmt/colors.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
import { ClientOf, createHttpClient } from "apps/utils/http.ts";
import { GranadoAPI } from "site/packs/utils/client/client.ts";
import { Secret } from "apps/website/loaders/secret.ts";
import { AppContext as RecordsContext } from "apps/records/mod.ts";
import { type Section } from "@deco/deco/blocks";
import { type App as A, type AppContext as AC } from "@deco/deco";
import { Environment } from "apps/website/loaders/environment.ts";

interface AlgoliaGranado {
  /**
   * @title Usar URL da Algolia
   * @description Se ativo é retornado a URL cadastrada na Algolia, se desativado usa a URL do projeto/Deco
   * @default false
   */
  algoliaUrlProducts?: boolean;
  /**
   * @default BRL
   */
  currencyCode?: string;
}
interface ConfigApiMagento {
  /**
   * @title Magento api url
   * @description The base url of the Magento API, If you have stores, put the name of the store at the end.
   * @example https://magento.com/rest/store1 or https://magento.com/rest
   */
  baseUrl: string;
  /** @title Magento api key */
  apiKeyV2?: Secret;
  /** @title Magento store */
  site: string;
  /** @title Magento store id */
  storeId: number;
  /**
   * @title Currency Code
   * @description The currency code to be used in the requests: USD, BRL, EUR.
   */
  currencyCode: string;
  /**
   * @title Images URL
   * @description The base url of the images.
   * @example https://www.store.com.br/media/catalog/product
   */
  imagesUrl: string;
  /** @ignore */
  clientGranadoApi: ClientOf<GranadoAPI>;
}
export type Features = {
  /**
   * @title DANGEROUSLY Disable onLoad Update
   * @description After a page load/refresh, the store state will not be updated
   * @default false
   */
  dangerouslyDisableOnLoadUpdate?: boolean;
  /**
   * @title DANGEROUSLY Disable OnVisibilityChange Update
   * @description After an idle, the store state will not be updated
   * @default false
   */
  dangerouslyDisableOnVisibilityChangeUpdate?: boolean;
  /**
   * @title DANGEROUSLY Don't invoke loaders after any action
   * @description When called, the action will return just an success statement
   * @default false
   */
  dangerouslyReturnOnlyStatement?: boolean;
  /**
   * @title Don't invoke cart loaders after "AddItem" action
   * @description When called, the "AddItem" action will return just an success or error statement
   * @default false
   */
  dontUpdateCartAfterAddItem?: boolean;
};
export type Props =
  & {
    /**
     * @title Active Commerce Platform
     * @description Choose the active ecommerce platform
     * @default custom
     */
    platform: Platform;
    theme?: Section;
    magento: ConfigApiMagento;
    /**
     * @title DANGEROUSLY Features
     * @description Only enable any of these if you`re sure. Can break site
     */
    features: Features;
    /** @title Magento secret header (verified by origin) */
    originHeader?: Secret;
  }
  & CommerceProps
  & AlgoliaGranado;
export type Platform =
  | "vtex"
  | "vnda"
  | "shopify"
  | "wake"
  | "linx"
  | "nuvemshop"
  | "magento"
  | "custom";
export let _platform: Platform = "custom";
export type App = ReturnType<typeof Site>;
export type AppContext = AC<App> & RecordsContext;
const color = (platform: string) => {
  switch (platform) {
    case "vtex":
      return vtex;
    case "vnda":
      return vnda;
    case "wake":
      return wake;
    case "shopify":
      return shopify;
    case "linx":
      return linx;
    case "nuvemshop":
      return nuvemshop;
    case "deco":
      return 0x02f77d;
    default:
      return 0x212121;
  }
};
let firstRun = true;
export default function Site({ theme, ...state }: Props): A<Manifest, Props, [
  ReturnType<typeof commerce>,
]> {
  _platform = state.platform || state.commerce?.platform || "custom";
  const apiKey = state?.magento?.apiKeyV2?.get() ?? "";
  const baseUrl = state?.magento?.baseUrl ?? "";
  const originHeaderValue = state.originHeader?.get?.();
  const originHeaderHTTP: Record<string, string> = originHeaderValue ? { "x-origin-header": originHeaderValue } : {};
  const clientGranadoApi = createHttpClient<GranadoAPI>({
    base: baseUrl,
    headers: new Headers({
      Authorization: `Bearer ${apiKey}`,
      ...originHeaderHTTP
    }),
  });
  
  const magento = {
    ...state.magento,
    clientGranadoApi,
  };
  // Prevent console.logging twice
  if (firstRun) {
    firstRun = false;
    console.info(
      ` 🐁 ${rgb24("Storefront", color("deco"))} | ${
        rgb24(_platform, color(_platform))
      } \n`,
    );
  }
  return {
    state: {
      ...state,
      magento,
    },
    manifest,
    dependencies: [
      commerce({
        ...state,
        global: theme ? [...(state.global ?? []), theme] : state.global,
      }),
    ],
  };
}
export { onBeforeResolveProps, Preview } from "apps/website/mod.ts";
