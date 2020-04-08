import { Context, Next } from 'koa';

import { Product } from '../models/product.model';
import { validatePartialProduct, validateProduct } from '../validation/product.validation';
import { findProductQuery, getProductsQuery, updateProductQuery, createProductQuery, deleteProductQuery } from '../database/product.queries';

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
    const productToUpdate: Product = ctx.request.body.product;
    validatePartialProduct(productToUpdate);
    const product: Product = await updateProductQuery(ctx.params.id, productToUpdate);
    product ? ctx.ok(product) : ctx.throwNotFound(`Invalid id ${ctx.params.id}`);
    await next();
}

export const createProduct = async (ctx: Context, next: Next) => {
    const productToCreate = ctx.request.body.product;
    validateProduct(productToCreate);
    const product: Product = await createProductQuery(productToCreate);
    ctx.created(product);
    await next();
}

export const deleteProduct = async (ctx: Context, next: Next) => {
    const product: Product = await deleteProductQuery(ctx.params.id);
    product ? ctx.ok(product) : ctx.throwNotFound(`Product ${ctx.params.id} does not exist`);
    await next();
}
