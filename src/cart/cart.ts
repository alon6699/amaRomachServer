import { Cart } from "./types/cart.type";
import { Product } from "../models/product.model";
import { findProductQuery } from "../database/product.queries";

const carts: Record<string, Cart> = {};

export const addCart = (id: string) => {
    if (!carts[id]) {
        carts[id] = {};
    }
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
        if(!product) {
            throw new Error(`Could not find product with id ${productId}`);
        }
        if (product.limit !== undefined && amount > product.limit) {
            throw new Error(`Received amount ${amount} bigger than products ${productId} limit ${product.limit}`);
        }
        amount === 0 ? removeCartProduct(userId, productId) : updateCartProduct(userId, productId, amount);
        return product;
    } else {
        throw new Error(`Received negative amount ${amount} to set product ${productId} cart amount`);
    }
}
