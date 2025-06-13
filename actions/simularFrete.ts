import { AppContext } from "site/apps/site.ts";

export interface Props {
  sku: string;
  cep: string;
}

export default async function simularFrete(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<any> {
  const { sku, cep } = props;

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 2astmbntgsxgmnj8kcb35m3ulg8gcooj" 
  };

  try {
    
    const cartRes = await fetch("https://loja.granado.com.br/rest/V1/guest-carts", {
      method: "POST",
      headers,
    });
    const cartId = await cartRes.text();

    console.log("piraminho", cartId, sku, typeof sku);


    const resu = await fetch(`https://loja.granado.com.br/rest/V1/guest-carts/${cartId.replaceAll('"', '')}/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        cartItem: {
          quote_id: cartId.replaceAll('"', ''),
          sku,
          qty: 1,
        },
      }),
    });
    
    console.log("piraminho2", await resu.text());

    const resu2 = await fetch(`https://loja.granado.com.br/rest/V1/guest-carts/${cartId.replaceAll('"', '')}/estimate-shipping-methods`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        address: {
          country_id: "BR",
          postcode: cep
        },
      }),
    });

    return await resu2.json();
  } catch (e) {
    console.error(e);
    return { error: "Erro ao simular frete" };
  }
}
