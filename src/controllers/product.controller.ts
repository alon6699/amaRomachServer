import { Context } from 'koa';
import { ProductSchema } from "../schemas/product.schema";
import { logger } from '../logger/logger';
import { Product } from '../models/product.model';
import { validatePartialProduct, validateProduct } from '../validation/product.validation';

export const getProducts = async (ctx: Context) => {
    try {
        const products: Product[] = await ProductSchema.find();
        ctx.ok(products);
        logger.info('Get all products');
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

export const findProduct = async (ctx: Context) => {
    try {
        const product: Product = await ProductSchema.findOne({ 'name': ctx.params.name });
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

export const updateProduct = async (ctx: Context) => {
    try {
        const productToUpdate: Product = ctx.request.body.product;
        if (productToUpdate) {
            const { error } = validatePartialProduct(productToUpdate);
            if (!error) {
                const product: Product = await ProductSchema.findOneAndUpdate({ name: productToUpdate.name }, productToUpdate, { new: true });
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

export const createProduct = async (ctx: Context) => {
    try {
        const productToAdd = ctx.request.body.product;
        if (productToAdd) {
            const { error } = validateProduct(productToAdd);
            if (!error) {
                const product: Product = await ProductSchema.create(productToAdd);
                ctx.created(product);
                logger.info(`Create new product ${JSON.stringify(product)}`);
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
            logger.error(`Product with name ${ctx.request.body.product} is already exists. ${error}`);
        } else {
            serverInternalError(ctx, error);
        }
    }
}

export const deleteProduct = async (ctx: Context) => {
    try {
        const product: Product = await ProductSchema.findOneAndDelete({ 'name': ctx.params.name });
        if (product) {
            ctx.ok(product);
            logger.info(`Product ${ctx.params.name} was deleted Successfully`);
        } else {
            ctx.notFound(`Product ${ctx.params.name} does not exist`);
            logger.error(`Cannot delete product. Invalid name ${ctx.params.name}`);
        }
    } catch (error) {
        serverInternalError(ctx, error);
    }
}

const serverInternalError = (ctx: Context, error: Error) => {
    ctx.internalServerError();
    logger.error(error.message);
}

const handleInvalidProductStructure = (ctx: Context, error: Error) => {
    const errorMessage: string = `Invalid product structure ${error}`;
    ctx.badRequest(errorMessage);
    logger.error(errorMessage);
}