import { AppContext } from "site/apps/site.ts";
import { getCookies, setCookie } from "std/http/cookie.ts";

const MAGENTO_UPDATE_COOKIE = "process_cart_deco";

const loader = (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): { update: boolean } => {
  const url = new URL(req.url);

  const isLocalhost = url.hostname === "localhost";

  const hasUpdateCookie = getCookies(req.headers)[MAGENTO_UPDATE_COOKIE];

  if (hasUpdateCookie) {
    setCookie(ctx.response.headers, {
      name: MAGENTO_UPDATE_COOKIE,
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
      domain: isLocalhost ? undefined : ".granado.com.br",
    });

    return { update: true };
  }

  return { update: false };
};

export default loader;
