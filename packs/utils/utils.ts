import { AppContext } from "site/apps/site.ts";
import {
  CartWithGW,
  ErrorGiftAPI,
  ProductsGift,
  ResponseMessage,
} from "site/packs/utils/client/types.ts";
import giftWrapping from "../giftWrapping/cart.ts";
import gift from "../giftItem/gift.ts";

export const giftWrappingActionHandler = async (
  returnOnlyStatement: boolean,
  options: {
    req: Request;
    ctx: AppContext;
    responseMessage: ResponseMessage;
  },
): Promise<CartWithGW> => ({
  ...returnOnlyStatement
    ? { designs_info: [] }
    : await giftWrapping(null, options.req, options.ctx) ??
      { designs_info: [] },
  ...options.responseMessage,
});

export const giftActionHandler = async (
  returnOnlyStatement: boolean,
  options: {
    req: Request;
    ctx: AppContext;
    responseMessage: ResponseMessage | ErrorGiftAPI;
  },
): Promise<ProductsGift | ErrorGiftAPI> => ({
  ...returnOnlyStatement
    ? { products: [] }
    : await gift(null, options.req, options.ctx) as
      | ProductsGift
      | ErrorGiftAPI ??
      { products: [] },
  ...options.responseMessage,
});
