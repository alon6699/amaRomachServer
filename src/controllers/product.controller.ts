import { Context, Next } from 'koa';

import { Product } from '../models/product.model';
import { findProductQuery, getProductsQuery, updateProductQuery, createProductQuery, deleteProductQuery } from '../database/product.queries';
import { cart } from '../web-socket/web-sokcet';

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
