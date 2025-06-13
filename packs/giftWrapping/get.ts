import { AppContext } from "site/apps/site.ts";
import getClientMagento from "site/packs/utils/getClientMagento.ts";
import stringifySearchCriteria from "site/packs/utils/stringifySearchCriteria.ts";
import { GIFT_AVAILABLE } from "site/packs/utils/constants.ts";
export interface Props {
  sku: string;
}

async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { magento: { site } } = ctx;
  const { sku } = props;

  const clientAdmin = getClientMagento(ctx);

  try {
    const product = await clientAdmin
      ["GET /rest/:site/V1/products/:sku"]({ site, sku }).then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar embrulhos de presente");
        }
        return res.json();
      });

    const giftWrappingAttr = product.custom_attributes.find((attr) =>
      attr.attribute_code === GIFT_AVAILABLE
    );

    if (
      !giftWrappingAttr ||
      (giftWrappingAttr.value !== "1" && giftWrappingAttr.value !== "2")
    ) {
      return { hasGiftWrapping: false };
    }

    const searchCriteria = {
      currentPage: 1,
    };

    const queryParams = {
      ...stringifySearchCriteria(searchCriteria),
      currentPage: 1,
    };

    const giftWrappings = await clientAdmin
      ["GET /rest/:site/V1/gift-wrappings/"]({
        ...queryParams,
        site,
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar embrulhos de presente");
        }
        return res.json();
      });

    const applicableWrappings = giftWrappings.items.filter((
      wrap: { website_ids: number[] },
    ) => wrap.website_ids.includes(1));

    const wrappingDetailsPromises = applicableWrappings.map((
      wrap: { wrapping_id: string },
    ) =>
      clientAdmin["GET /rest/:site/V1/gift-wrappings/:id"]({
        site,
        id: wrap.wrapping_id,
      })
    );
    const wrappingDetailsResponses = await Promise.all(wrappingDetailsPromises);
    const wrappingDetails = await Promise.all(
      wrappingDetailsResponses.map((res: Response) => res.json()),
    );

    return { hasGiftWrapping: true, giftWrappings: wrappingDetails };
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

export default loader;
