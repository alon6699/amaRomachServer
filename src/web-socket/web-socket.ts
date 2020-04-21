import { Socket } from "socket.io";

import { webSocket } from "..";
import { Product } from "../models/product.model";
import { findProductQuery, checkoutQuery } from "../database/product.queries";
import { logger } from "../logger/logger";
import { addCart, removeCart, calculateProductLimit, removeCartProduct, updateCartProduct, resetCart, getCart } from "../cart/cart";

export const registerSocket = (socket: Socket, next: (err?: Error) => void) => {
    logger.info(`A user connected ${socket.id}`);
    addCart(socket.id);
    next();
}

const clearCart = async (socket: Socket) =>
    await Promise.all(Object.keys(getCart(socket.id))
        .map(id => manageProductInCart(socket)({ id, amount: 0 })))

export const removeSocket = (socket: Socket) => async () => {
    logger.info(`A user disconnected ${socket.id}`);
    await clearCart(socket);
    removeCart(socket.id);
}

const updateProductCartAmount = (socketId: string, product: Product, amount: number) => {
    amount === 0 ?
        removeCartProduct(socketId, product._id) :
        updateCartProduct(socketId, product._id, amount);
    if (product.limit !== undefined) {
        const limit: number = calculateProductLimit(product._id, product.limit);
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
    checkoutQuery(getCart(socket.id))
        .then(() => socket.emit('checkout', { purchased: true }))
        .catch(error => {
            clearCart(socket);
            socket.emit('checkout', { purchased: false, error: error.message })
        })
        .finally(() => resetCart(socket.id))
