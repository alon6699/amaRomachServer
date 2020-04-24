import { Cart } from "./types/cart.type";

const carts: Record<string, Cart> = {};

export const addCart = (id: string) => {
    carts[id] = {};
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

