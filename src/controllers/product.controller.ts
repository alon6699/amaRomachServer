import * as koa from 'koa';
import { model } from "mongoose";
import { productSchema } from "../schemas/product.schema";

export const Product = model('Product', productSchema);

export async function products(ctx: koa.Context) {
    try {
        const products = await Product.find();
        ctx.ok(products);
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function findProduct(ctx: koa.Context) {
    try {
        const product = await Product.findOne({ 'name': ctx.params.name });
        if (product) {
            ctx.ok(product)
            console.log('find product by name', ctx.params.name);
        } else {
            ctx.notFound(ctx.params.name);
            console.log('invalid name', ctx.params.name);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function updateProduct(ctx: koa.Context) {
    try {
        if (ctx.request.body.product) {
            const productToUpdate = ctx.request.body.product;
            const product = await Product.findOneAndUpdate({ name: productToUpdate.name }, productToUpdate, { new: true });
            if (product) {
                ctx.ok(product);
            } else {
                ctx.notFound(productToUpdate);
                console.log('invalid name', ctx.params.name);
            }
        } else {
            ctx.status = 400;
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function addProduct(ctx: koa.Context) {
    try {
        const product = await Product.findOne({ 'name': ctx.params.name });
        ctx.body = {
            status: 'success',
            data: product
        };
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function deleteProduct(ctx: koa.Context) {
    try {
        const product = await Product.findOne({ 'name': ctx.params.name });
        ctx.body = {
            status: 'success',
            data: product
        };
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

const serverInternalError = (ctx: koa.Context, error: Error) => {
    ctx.internalServerError(500);
    console.log(error);
}