import { Context } from 'koa';
import { model } from "mongoose";
import { productSchema } from "../schemas/product.schema";
import { logger } from '../../config/winston/winston';
import { Product } from '../models/product.model';

const Product = model<Product>('Product', productSchema);

export async function products(ctx: Context) {
    try {
        const products: Product[] = await Product.find();
        ctx.ok(products);
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function findProduct(ctx: Context) {
    try {
        const product = await Product.findOne({ 'name': ctx.params.name });
        if (product) {
            ctx.ok(product)
            logger.info('find product by name ' + ctx.params.name);
        } else {
            ctx.notFound(ctx.params.name);
            logger.error('invalid name ' + ctx.params.name);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function updateProduct(ctx: Context) {
    try {
        //TODO: make product validation
        if (ctx.request.body.product) {
            const productToUpdate: Product = ctx.request.body.product;
            const product: Product = await Product.findOneAndUpdate({ name: productToUpdate.name }, productToUpdate, { new: true });
            if (product) {
                ctx.ok(product);
                logger.info('update product by name ' + productToUpdate.name);
            } else {
                ctx.notFound(productToUpdate);
                logger.error('invalid name ' + productToUpdate.name);
            }
        } else {
            ctx.badRequest();
            logger.error('received undefined product');
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function addProduct(ctx: Context) {
    try {
        //TODO: make product validation
        if (ctx.request.body.product) {
            const productToAdd = ctx.request.body.product;
            const product: Product = await Product.create(productToAdd);
            if (product) {
                ctx.ok(product);
                logger.info('Create new product' + JSON.stringify(product));
            }
        } else {
            ctx.badRequest();
            logger.error('Cannot create product. Received undefined product in body request');
        }
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            ctx.send(409, 'Product is already existing');
            logger.error('Product with name' + ctx.request.body.product + ' is already existing. ' + error);
        } else {
            serverInternalError(ctx, error);
        }
    }
}

export async function deleteProduct(ctx: Context) {
    try {
        const { deletedCount } = await Product.deleteOne({ 'name': ctx.params.name });
        if (deletedCount === 1) {
            ctx.ok('product ' + ctx.params.name + ' was deleted Successfully');
            logger.info('product ' + ctx.params.name + ' was deleted Successfully');
        } else {
            ctx.notFound();
            logger.error('Cannot delete product. Invalid name ' + ctx.params.name);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

const serverInternalError = (ctx: Context, error: Error) => {
    ctx.internalServerError();
    logger.error(error);
}