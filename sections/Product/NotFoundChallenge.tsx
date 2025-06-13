// deno-lint-ignore-file no-explicit-any
import { asResolved, isDeferred, type SectionProps } from "@deco/deco";
import { type Section } from "@deco/deco/blocks";
import { AppContext } from "site/magento/mod.ts";
export interface Props {
  /** @title On Product Found */
  children: Section;
  /** @title On Product Not Found */
  fallback: Section;
}
export const loader = async ({ fallback, children }: Props, req: Request, ctx: AppContext) => {
  const url = new URL(req.url);
  const pageType = await ctx.invoke.magento.loaders.routes.getRouteType({
    path: url.pathname.replace("/granado", ""),
  })

  if (pageType.type === "CATEGORY" && isDeferred(fallback)) {
    return { Component: await fallback() as any };
  }
  if (pageType.type === "PRODUCT" && isDeferred(children)) {
    return { Component: await children() as any };
  }
  throw new Error("Missing defferred children");
};
function NotFoundChallenge({ Component }: SectionProps<typeof loader>) {
  return <Component.Component {...Component.props} />;
}
const DEFERRED = true;
export const onBeforeResolveProps = (props: Props) => ({
  ...props,
  children: asResolved(props.children, DEFERRED),
  fallback: asResolved(props.fallback, DEFERRED),
});
export function LoadingFallback() {
  return (
    <div class="h-screen flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
export default NotFoundChallenge;
