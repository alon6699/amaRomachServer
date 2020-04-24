import { Context, Next } from 'koa';

import { Product } from '../../models/product.model';
import {
    findProductQuery,
    getProductsQuery,
    updateProductQuery,
    createProductQuery,
    deleteProductQuery,
    checkoutQuery
} from '../../database/product.queries';
import { getCart, resetCart } from '../../cart/cart';
import { clearCart } from '../../web-socket/web-socket';
import { Cart } from '../../cart/types/cart.type';

export const getProducts = async (ctx: Context, next: Next) => {
    const products: Product[] = await getProductsQuery();
    ctx.ok(products);
    await next();
}

export const findProduct = async (ctx: Context, next: Next) => {
    const product: Product = await findProductQuery(ctx.params.id);
    product ? ctx.ok(product) : ctx.throwNotFound(`Invalid id ${ctx.params.id}`);
    await next();
}

export const updateProduct = async (ctx: Context, next: Next) => {
    const product: Product = await updateProductQuery(ctx.params.id, ctx.request.body.product);
    product ? ctx.ok(product) : ctx.throwNotFound(`Invalid id ${ctx.params.id}`);
    await next();
}

export const createProduct = async (ctx: Context, next: Next) => {
    const product: Product = await createProductQuery(ctx.request.body.product);
    ctx.created(product);
    await next();
}

export const deleteProduct = async (ctx: Context, next: Next) => {
    const product: Product = await deleteProductQuery(ctx.params.id);
    product ? ctx.ok(product) : ctx.throwNotFound(`Product ${ctx.params.id} does not exist`);
    await next();
}

export const checkout = async (ctx: Context, next: Next) => {
    const socketId: string = ctx.cookies.get('userId.sig');
    try {
        const cart: Cart = getCart(socketId);
        if (!cart) {
            ctx.throwInternalServerError('purchase failed');
        }
        await checkoutQuery(cart);
        ctx.ok('purchase successfully completed');
        await next();
    } catch (error) {
        clearCart(socketId);
        ctx.throwInternalServerError(error.message);
    } finally {
        resetCart(socketId);
    }
}
