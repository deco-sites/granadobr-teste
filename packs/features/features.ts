import { AppContext, Features } from "site/apps/site.ts";

export interface Error {
  status: number;
  message: string;
}

/**
 * @title Features
 */
const loader = (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Features => {
  return {
    dangerouslyDisableOnLoadUpdate:
      ctx?.features?.dangerouslyDisableOnLoadUpdate ?? false,
    dangerouslyDisableOnVisibilityChangeUpdate:
      ctx?.features?.dangerouslyDisableOnVisibilityChangeUpdate ?? false,
    dangerouslyReturnOnlyStatement:
      ctx?.features?.dangerouslyReturnOnlyStatement ?? false,
  };
};

export default loader;
