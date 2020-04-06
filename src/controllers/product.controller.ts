import { Context } from 'koa';
import { ProductSchema } from "../schemas/product.schema";
import { logger } from '../logger/logger';
import { Product } from '../models/product.model';
import { validatePartialProduct, validateProduct } from '../validation/product.validation';

export const getProducts = async (ctx: Context) => {
    const products: Product[] = await ProductSchema.find();
    ctx.ok(products);
}

export const findProduct = async (ctx: Context) => {
    const product: Product = await ProductSchema.findOne({ '_id': ctx.params.id });
    product ? ctx.ok(product) : ctx.throwNotFound(`Invalid id ${ctx.params.id}`);
}

export const updateProduct = async (ctx: Context) => {
    const productToUpdate: Product = ctx.request.body.product;
    if (productToUpdate) {
        const { error } = validatePartialProduct(productToUpdate);
        if (!error) {
            const product: Product = await ProductSchema.findOneAndUpdate({ _id: ctx.params.id }, productToUpdate, { new: true });
            product ? ctx.ok(product) : ctx.throwNotFound(`Invalid id ${ctx.params.id}`);
        } else {
            ctx.throwBadRequest(`Invalid product structure ${error}`);
        }
    } else {
        ctx.throwBadRequest('Received undefined product');
    }
}

export const createProduct = async (ctx: Context) => {
    const productToAdd = ctx.request.body.product;
    if (productToAdd) {
        const { error } = validateProduct(productToAdd);
        if (!error) {
            const product: Product = await ProductSchema.create(productToAdd);
            ctx.created(product);
        } else {
            ctx.throwBadRequest(`Invalid product structure ${error}`);
        }
    } else {
        ctx.throwBadRequest('Received undefined product');
    }
}

export const deleteProduct = async (ctx: Context) => {
    const product: Product = await ProductSchema.findOneAndDelete({ '_id': ctx.params.id });
    product ? ctx.ok(product) : ctx.throwNotFound(`Product ${ctx.params.id} does not exist`);
}
