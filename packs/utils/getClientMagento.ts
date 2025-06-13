import { AppContext } from "site/apps/site.ts";

/**
 * Returns the Magento client.
 *
 * @param ctx
 * @returns {magentoClient} http client
 */
export default function getClientMagento(ctx: AppContext) {
  return ctx.magento.clientGranadoApi;
}
