import { isArray } from "util";
import { Next, Context } from "koa";

import { Product } from "../../models/product.model";
import { webSocket } from "../..";
import { calculateProductLimit } from "../../cart/cart";

const updateProductLimit = (product: Product): Product =>
    product.limit ?
        ({ ...product.toObject(), limit: calculateProductLimit(product.id, product.limit) }) :
        product;

export const updateProductLimitMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    const data: Product | Product[] = ctx.body;
    ctx.ok(isArray(data) ? data.map(updateProductLimit) : updateProductLimit(data));
    return await next();
}

export const productChangesMiddleware = (deleted: boolean) =>
    async (ctx: Context, next: Next): Promise<void> => {
        const product: Product = ctx.body;
        webSocket.emit('productChanges', { ...product.toObject(), deleted });
        return await next();
    }
