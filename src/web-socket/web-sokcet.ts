import { Context, Next } from "koa";
import { webSocket } from "..";
import { Product } from "../models/product.model";
import { findProductQuery } from "../database/product.queries";

export const cart: Record<string, Record<string, number>> = {};
export const productChangesMiddleware = (deleted: boolean) => {
    return async (ctx: Context, next: Next) => {
        const product: Product = ctx.body;
        webSocket.emit('productChanges', { ...product, deleted });
        await next();
    }
}

export const calculateProductLimit = (id: string) =>
    Object.values(cart).reduce((acc, productInCart) => productInCart[id] ? acc + productInCart[id] : acc, 0);

export const manageProductInCart = (socket) => {
    return async ({ id, amount }: { id: string, amount: number }) => {
        const product: Product = await findProductQuery(id);
        if (amount < 0 || amount > product.limit) {
            throw new Error('amount is negative');
        }
        if (amount === 0) {
            delete cart[socket.id][id];
        } else {
            cart[socket.id][id] = amount;
        }
        socket.broadcast.emit('productChanges', { ...product, limit: calculateProductLimit(id) });
    };
}

export const checkout = (socket) => {
    return async () => {
        const userCart = cart[socket.id];
        
    };
} 