import { webSocket } from "..";
import { calculateProductLimit, getCart, removeCart, updateProductInCart } from "../cart/cart";
import { logger } from "../logger/logger";

export const clearCart = async (socketId: string) =>
    await Promise.all(Object.keys(getCart(socketId))
        .map(id => updateProductInCartSocket(socketId)({ id, amount: 0 })))

export const removeSocket = (socketId: string) => async () => {
    logger.info(`A user disconnected ${socketId}`);
    await clearCart(socketId);
    removeCart(socketId);
}

export const updateProductInCartSocket = (socketId: string) => {
    return async ({ id, amount }: { id: string, amount: number }) => {
        updateProductInCart(socketId, id, amount).then(product => {
            if (product.limit !== undefined) {
                const limit: number = calculateProductLimit(product._id, product.limit);
                webSocket.emit('productChanges', { ...product.toObject(), limit });
            }
        }).catch(e => logger.error(e.message));
    }
}
