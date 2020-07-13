import { Cart } from "./types/cart.type";
import { Product } from "../models/product.model";
import { findProductQuery } from "../database/product.queries";
import { logger } from "../logger/logger";
import * as cookie from 'cookie';
import { ConnectionContext } from 'subscriptions-transport-ws';
import { Socket } from "socket.io";
import { UserInputError } from "apollo-server";

const carts: Record<string, Cart> = {};

export const registerNewCart = (socket: ConnectionContext | Socket): string => {
    const userId: string = cookie.parse(socket.request.headers.cookie)['userId.sig'];
    logger.info(`Add new cart to user ${userId}`);
    carts[userId] = {};
    return userId;
}

export const getCart = (id: string): Cart => carts[id]

export const updateCartProduct = (cartId: string, productId: string, amount: number) => {
    carts[cartId][productId] = amount;
}

export const removeCart = (id: string) => {
    delete carts[id];
}

export const resetCart = (cartId: string) => {
    carts[cartId] = {};
}

export const removeCartProduct = (cartId: string, productId: string) => {
    delete carts[cartId][productId];
}

export const calculateProductLimit = (productId: string, currentLimit: number): number =>
    Object.values(carts).reduce((acc: number, cart: Cart) =>
        cart[productId] ? acc - cart[productId] : acc, currentLimit);


export const updateProductInCart = async (userId: string, productId: string, amount: number): Promise<Product> => {
    if (amount >= 0) {
        const product: Product = await findProductQuery(productId);
        if (!product) {
            throw new UserInputError(`Could not find product with id ${productId}`);
        }
        if (product.limit !== undefined && amount > product.limit) {
            throw new UserInputError(`Received amount ${amount} bigger than products ${productId} limit ${product.limit}`);
        }
        amount === 0 ? removeCartProduct(userId, productId) : updateCartProduct(userId, productId, amount);
        return product;
    } else {
        throw new UserInputError(`Received negative amount ${amount} to set product ${productId} cart amount`);
    }
}
