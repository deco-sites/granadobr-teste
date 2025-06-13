import type { AppContext } from "../../apps/site.ts";
import { asset } from "$fresh/runtime.ts";
import { Context } from "@deco/deco";
export default function HitLoadings() {
  return <></>;
}
export async function loader(p: unknown, _req: Request, ctx: AppContext) {
  const revision = await Context.active().release?.revision();
  const cssHref = asset("/styles.css?revision=" + revision);
  ctx.response.headers.append("link", `<${cssHref}>; rel=preload; as=style`);
  // ctx.response.headers.append(
  //   "link",
  //   `<${
  //     asset("/fonts/Matria[slnt,wdth,wght].woff2")
  //   }>; rel=preload; as=font; type=font/woff2`,
  // );
  ctx.response.headers.append(
    "link",
    `<${asset("/fonts/Granado.woff2")}>; rel=preload; as=font; type=font/woff2`,
  );
  return p;
}
