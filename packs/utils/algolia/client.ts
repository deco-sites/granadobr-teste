import { AppContext } from "site/apps/site.ts";

/**
 * Returns the Algolia client.
 *
 * @param ctx
 * @returns {AlgoliaSearch} SearchClient
 */
export function getClientAlgolia(ctx: AppContext) {
  return ctx.clientAlgolia;
}

/**
 * Returns the Algolia client.
 *
 * @param ctx
 * @returns {AlgoliaSearch} SearchClient
 */
export async function getClientAlgoliaRecommendation(
  ctx: AppContext,
  apiKey: string,
  applicationId: string,
) {
  return await ctx.invoke["site"].loaders.algolia.recommends
    .client({
      apiKey,
      applicationId,
    });
}
