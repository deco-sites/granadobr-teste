import { FreshContext } from "$fresh/server.ts";

const CHECKOUT_PATHS_TO_PROXY = [
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
  "/granado/checkout/*",
  "/granado/checkout",
  "/granado/customer/*",
  "/granado/customer",
  "/granado/wishlist/*",
  "/granado/wishlist",
  "/granado/sales/*",
  "/granado/sales",
  "/granado/vault/*",
  "/granado/vault",
];

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  const url = new URL(req.url);

  if (
    CHECKOUT_PATHS_TO_PROXY.some((path) => {
      if (path.endsWith("/*")) {
        return url.pathname.startsWith(path.slice(0, -2));
      }
      return url.pathname === path;
    })
  ) {
    url.host = "loja.granado.com.br";
    return Response.redirect(url.href, 307);
  }

  return await ctx.next();
}
