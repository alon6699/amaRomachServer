import { Context } from 'koa';
import { model, Model } from "mongoose";
import { productSchema } from "../schemas/product.schema";
import { logger } from '../../config/winston/winston';
import { Product } from '../models/product.model';
import { validatePartialProduct, validateProduct } from '../validation/product.validation';

const Product: Model<Product> = model<Product>('Product', productSchema);

export async function getProducts(ctx: Context) {
    try {
        const products: Product[] = await Product.find();
        ctx.ok(products);
        logger.info('Get all products');
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function findProduct(ctx: Context) {
    try {
        const product = await Product.findOne({ 'name': ctx.params.name });
        if (product) {
            ctx.ok(product);
            logger.info(`Find product by name ${ctx.params.name}`);
        } else {
            const errorMessage: string = 'Invalid name ' + ctx.params.name;
            ctx.notFound(errorMessage);
            logger.error(errorMessage);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function updateProduct(ctx: Context) {
    try {
        if (ctx.request.body.product) {
            const productToUpdate: Product = ctx.request.body.product;
            const { error } = validatePartialProduct(productToUpdate);
            if (!error) {
                const product: Product = await Product.findOneAndUpdate({ name: productToUpdate.name }, productToUpdate, { new: true });
                if (product) {
                    ctx.ok(product);
                    logger.info(`Update product by name ${product.name} with data: ${JSON.stringify(product)}`);
                } else {
                    ctx.notFound(`Invalid name ${productToUpdate.name}`);
                    logger.error(`Invalid name ${productToUpdate.name}`);
                }
            } else {
                handleInvalidProductStructure(ctx, error);
            }
        } else {
            ctx.badRequest();
            logger.error('Received undefined product');
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export async function addProduct(ctx: Context) {
    try {
        if (ctx.request.body.product) {
            const productToAdd = ctx.request.body.product;
            const { error } = validateProduct(productToAdd);
            if (!error) {
                const product: Product = await Product.create(productToAdd);
                if (product) {
                    ctx.ok(product);
                    logger.info(`Create new product ${JSON.stringify(product)}`);
                }
            } else {
                handleInvalidProductStructure(ctx, error);
            }
        } else {
            ctx.badRequest('Received undefined product');
            logger.error('Received undefined product');
        }
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            ctx.send(409, `Product ${ctx.request.body.product.name} is already existing`);
            logger.error(`Product with name ${ctx.request.body.product} is already existing. ${error}`);
        } else {
            serverInternalError(ctx, error);
        }
    }
}

export async function deleteProduct(ctx: Context) {
    try {
        const { deletedCount } = await Product.deleteOne({ 'name': ctx.params.name });
        if (deletedCount === 1) {
            ctx.ok(ctx.params.name);
            logger.info('Product ' + ctx.params.name + ' was deleted Successfully');
        } else {
            ctx.notFound(`Product ${ctx.params.name} does not exist`);
            logger.error(`Cannot delete product. Invalid name ${ctx.params.name}`);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

function serverInternalError(ctx: Context, error: Error) {
    ctx.internalServerError();
    logger.error(error.message);
}

function handleInvalidProductStructure(ctx: Context, error: Error) {
    const errorMessage: string = `Invalid product structure ${error}`;
    ctx.badRequest(errorMessage);
    logger.error(errorMessage);
}