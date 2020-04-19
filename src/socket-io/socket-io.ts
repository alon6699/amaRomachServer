import { Context, Next } from "koa";
import { Socket } from "socket.io";
import { isArray } from "util";

import { webSocket } from "..";
import { Product } from "../models/product.model";
import { findProductQuery, checkoutQuery } from "../database/product.queries";
import { logger } from "../logger/logger";

const cart: Record<string, Record<string, number>> = {};

export const registerSocket = (socket: Socket, next: (err?: Error) => void) => {
    logger.info(`a user connected ${socket.id}`);
    cart[socket.id] = {};
    next();
}

export const removeSocket = (socket: Socket) => () => delete cart[socket.id]

export const productChangesMiddleware = (deleted: boolean) =>
    async (ctx: Context, next: Next) => {
        const product: Product = ctx.body;
        webSocket.emit('productChanges', { ...product, deleted });
        await next();
    }

export const changeProductLimit = async (ctx: Context, next: Next): Promise<void> => {
    const data: Product | Product[] = ctx.body;
    isArray(data) ?
        data.filter(product => product.limit).forEach(product => product.limit -= calculateProductLimit(product.id)) :
        data.limit -= calculateProductLimit(data.id);
    ctx.ok(data);
    await next();
}

export const calculateProductLimit = (id: string) =>
    Object.values(cart).reduce((acc, productInCart) =>
        productInCart[id] ? acc + productInCart[id] : acc, 0);

export const manageProductInCart = (socket: Socket) => {
    return async ({ id, amount }: { id: string, amount: number }) => {
        logger.info(id, amount);
        const product: Product = await findProductQuery(id);
        if (amount < 0 || amount > product.limit) {
            throw new Error('amount is negative');
        }
        if (amount === 0) {
            delete cart[socket.id][id];
        } else {
            cart[socket.id][id] = amount;
        }
        console.log(cart);
        webSocket.emit('productChanges', { ...product.toObject(), limit: product.limit - calculateProductLimit(id) });
    };
}


export const checkout = (socket: Socket) => async () =>
    checkoutQuery(cart[socket.id])
        .then(() => socket.emit('checkout', {}))
        .catch(error => socket.emit('checkout', error.message))
        .finally(() => cart[socket.id] = {})
