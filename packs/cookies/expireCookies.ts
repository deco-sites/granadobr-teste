import { AppContext } from "site/apps/site.ts";
import { getCookies, setCookie } from "std/http/cookie.ts";

const EXPIRED_COOKIE_NAME = "expired_cookie_v10";
const DEFAULT_COOKIE_NAMES = [
  "dataservices_cart_id",
  "PHPSESSID",
  "form_key",
];
const SUMMARY_COOKIE_NAME = "summary_count";

const loader = (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): boolean | null => {
  const url = new URL(req.url);
  DEFAULT_COOKIE_NAMES.forEach((v) => {
    setCookie(ctx.response.headers, {
      name: v,
      value: "",
      path: "/",
      expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
    });
  });

  const expired_cookie = getCookies(req.headers)[EXPIRED_COOKIE_NAME];
  if (!expired_cookie && url.origin.endsWith(".granado.com.br")) {
    [...DEFAULT_COOKIE_NAMES, SUMMARY_COOKIE_NAME].forEach(
      (name) => {
        setCookie(ctx.response.headers, {
          name,
          value: "",
          path: "/",
          httpOnly: true,
          secure: true,
          expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
          domain: ".granado.com.br",
        });
      },
    );

    setCookie(ctx.response.headers, {
      name: EXPIRED_COOKIE_NAME,
      value: "1",
      path: "/",
      httpOnly: true,
      secure: true,
      domain: ".granado.com.br",
    });

    return true;
  }

  return null;
};

export default loader;
