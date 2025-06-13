import { AppContext } from "site/apps/site.ts";

declare global {
  interface Window {
    decoUrl: string;
  }
}

const maybeRedirectUser = () => {
  const PATHS_PATTERNS_TO_NOT_REDIRECT = [
    "/checkout/*",
    "/checkout",
    "/customer/*",
    "/customer",
    "/wishlist/*",
    "/wishlist",
    "/sales/*",
    "/sales",
    "/vault/*",
    "/vault",
    "/account/*",
    "/granado/recurring/subscription/*",
    "/loginascustomer/*",
    "/loginascustomer",
    "/granado/loginascustomer/*",
    "/granado/loginascustomer",
    "/granado/shipping/*",
    "/granado/granado_invoicelinks/*",
  ];

  const currentUrl = new URL(globalThis.window.location.href);
  const path = currentUrl.pathname;

  const ignoreRedirect =
    currentUrl.searchParams.get("ignoreRedirect") === "true";

  if (ignoreRedirect) {
    return;
  }

  const decoUrl = new URL(globalThis.window.decoUrl);

  const alreadyRedirected = currentUrl.origin === decoUrl.origin;

  const isCheckoutOrCustomerPath = PATHS_PATTERNS_TO_NOT_REDIRECT.some(
    (pattern) => {
      return new RegExp(pattern).test(path);
    },
  );

  if (isCheckoutOrCustomerPath || alreadyRedirected) {
    return;
  }

  const newUrl = new URL(
    currentUrl.pathname + currentUrl.search,
    decoUrl.origin,
  );
  const urlToRedirect = newUrl.href;
  globalThis.window.location.href = urlToRedirect;
};

export interface Props {
  decoHostToRedirect: string;
}

export default function abTestScript(
  props: Props,
  _req: Request,
  _ctx: AppContext,
) {
  return new Response(
    `globalThis.window.decoUrl = "${props.decoHostToRedirect}";
(${maybeRedirectUser})();`,
    {
      headers: {
        "Cache-Control": "public, max-age=30",
      },
    },
  );
}
