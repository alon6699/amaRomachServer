import { isArray } from "util";
import { Next, Context } from "koa";

import { Product } from "../models/product.model";
import { webSocket } from "..";
import { calculateProductLimit } from "../socket/socket";

const updateProductLimit = (product: Product) =>
    product.limit ?
        ({ ...product.toObject(), limit: product.limit - calculateProductLimit(product.id) }) :
        product;

export const changeProductClientLimitMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    const data: Product | Product[] = ctx.body;
    const updatedData = isArray(data) ? data.map(updateProductLimit) : updateProductLimit(data);
    ctx.ok(updatedData);
    await next();
}

export const productChangesMiddleware = (deleted: boolean) =>
    async (ctx: Context, next: Next) => {
        const product: Product = ctx.body;
        webSocket.emit('productChanges', { ...product.toObject(), deleted });
        await next();
    }
