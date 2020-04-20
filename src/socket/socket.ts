import { Socket } from "socket.io";

import { webSocket } from "..";
import { Product } from "../models/product.model";
import { findProductQuery, checkoutQuery } from "../database/product.queries";
import { logger } from "../logger/logger";

const carts: Record<string, Record<string, number>> = {};

export const registerSocket = (socket: Socket, next: (err?: Error) => void) => {
    logger.info(`A user connected ${socket.id}`);
    carts[socket.id] = {};
    next();
}

const clearCart = async (socket: Socket) =>
    await Promise.all(Object.keys(carts[socket.id])
        .map((id) => manageProductInCart(socket)({ id, amount: 0 })))

export const removeSocket = (socket: Socket) => async () => {
    logger.info(`A user disconnected ${socket.id}`);
    await clearCart(socket);
    delete carts[socket.id];
}

export const calculateProductLimit = (id: string): number =>
    Object.values(carts).reduce((acc, productInCart) =>
        productInCart[id] ? acc + productInCart[id] : acc, 0);

const updateProductCartAmount = (socketId: string, product: Product, amount: number) => {
    amount === 0 ? delete carts[socketId][product._id] : carts[socketId][product._id] = amount;
    if (product.limit !== undefined) {
        const limit: number = product.limit - calculateProductLimit(product._id);
        webSocket.emit('productChanges', { ...product.toObject(), limit });
    }
}

export const manageProductInCart = (socket: Socket) => {
    return async ({ id, amount }: { id: string, amount: number }) => {
        if (amount >= 0) {
            const product: Product = await findProductQuery(id);
            if (product.limit !== undefined && amount > product.limit) {
                logger.error(`Received amount ${amount} bigger than products ${id} limit ${product.limit}`);
            } else {
                updateProductCartAmount(socket.id, product, amount);
            }
        } else {
            logger.error(`Received negative amount ${amount} to set product ${id} cart amount`);
        }
    }
}

export const checkout = (socket: Socket) => () =>
    checkoutQuery(carts[socket.id])
        .then(() => socket.emit('checkout', { error: null }))
        .catch(error => {
            clearCart(socket);
            socket.emit('checkout', { error: error.message })
        })
        .finally(() => carts[socket.id] = {})
