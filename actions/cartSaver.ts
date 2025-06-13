import type { AppContext } from "site/apps/deco/records.ts";
import { cart } from "site/db/schema.ts";
import { eq } from "drizzle-orm";

interface Props {
  email: string;
  itensJson: string;
}

export default async function loader(
  { email, itensJson }: Props,
  _req: Request,
  ctx: AppContext,
) {
  const records = await ctx.invoke.records.loaders.drizzle();

  const currentCart = await records.select().from(cart).where(
    eq(cart.email, email),
  );

  if (currentCart.at(0)?.id) {
    const { id } = currentCart.at(0)!;
    const data = await records.update(cart).set({ json: itensJson }).where(
      eq(cart.id, id),
    );

    return data;
  }

  const data = await records.insert(cart).values({
    email,
    json: itensJson,
  });

  return data;
}
