import type { AppContext } from "site/apps/deco/records.ts";
import { cart } from "site/db/schema.ts";
import { and, eq } from "drizzle-orm";

interface Cart {
  id: string;
  email: string;
  json: string;
}

interface Props {
  cartId: string;
  email: string;
}

export default async function getCartByIdAndEmail(
  { cartId, email }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<{ error: true; message: string } | { error: false; cart: Cart }> {
  if (!cartId || !email) {
    return { error: true, message: "Missing cartId or email" };
  }

  const drizzle = await ctx.invoke.records.loaders.drizzle();

  try {
    const cartRow = await drizzle
      .select()
      .from(cart)
      .where(and(eq(cart.id, cartId), eq(cart.email, email)));

    if (!cartRow.length) {
      return { error: true, message: "Cart not found" };
    }

    return { error: false, cart: cartRow[0] as Cart };
  } catch (e) {
    ctx.monitoring?.logger.error(e);
    return { error: true, message: e.message };
  }
}
