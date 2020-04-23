import { Socket } from "socket.io";
import * as cookie from 'cookie';

import { webSocket } from "..";
import { Product } from "../models/product.model";
import { findProductQuery } from "../database/product.queries";
import { logger } from "../logger/logger";
import { addCart, removeCart, calculateProductLimit, removeCartProduct, updateCartProduct, getCart } from "../cart/cart";
import { store } from "../store/store";



export const registerSocket = (socket: Socket, next: (err?: Error) => void) => {
    logger.info(`A user connected ${socket.id}`);
    store.set(cookie.parse(socket.request.headers.cookie).id, socket.id);
    addCart(socket.id);
    next();
}

export const clearCart = async (socketId: string) =>
    await Promise.all(Object.keys(getCart(socketId))
        .map(id => manageProductInCart(socketId)({ id, amount: 0 })))

export const removeSocket = (socket: Socket) => async () => {
    logger.info(`A user disconnected ${socket.id}`);
    await clearCart(socket.id);
    removeCart(socket.id);
    store.delete(cookie.parse(socket.request.headers.cookie).id);
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

export const manageProductInCart = (socketId: string) => {
    return async ({ id, amount }: { id: string, amount: number }) => {
        if (amount >= 0) {
            const product: Product = await findProductQuery(id);
            if (product.limit !== undefined && amount > product.limit) {
                logger.error(`Received amount ${amount} bigger than products ${id} limit ${product.limit}`);
            } else {
                updateProductCartAmount(socketId, product, amount);
            }
        } else {
            logger.error(`Received negative amount ${amount} to set product ${id} cart amount`);
        }
    }
}
