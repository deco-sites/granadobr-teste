import { getCookies, setCookie } from "std/http/mod.ts";
//import { logger } from "deco/mod.ts";

const COOKIE_NAME = "sellerCode";

export const getSellerCookie = (req: Request): string | undefined => {
  const cookies = getCookies(req.headers);
  /*   if (cookies) {
    console.log({ cookies });
    logger.error(cookies);
  } */
  const cookie = cookies[COOKIE_NAME];
  return cookie;
};

export const setSellerCookie = (value: string, headers: Headers) =>
  setCookie(headers, {
    name: COOKIE_NAME,
    value: value,
    path: "/",
    httpOnly: true,
    secure: true,
  });

export const expireSellerCookie = (value: string, headers: Headers) =>
  setCookie(headers, {
    name: COOKIE_NAME,
    value: value,
    path: "/",
    httpOnly: true,
    secure: true,
    expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
  });
