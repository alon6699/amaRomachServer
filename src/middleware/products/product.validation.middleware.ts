import { Context, Next } from "koa";
import { ValidationOptions } from 'joi';
import { Product } from "../../models/product.model";
import { productValidationSchema } from "../../validation/product.validation";

export const validateProductMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    return validateProduct(ctx, next, { abortEarly: false, presence: 'required' });
}

export const validatePartialProductMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    return validateProduct(ctx, next, { abortEarly: false });
}

const validateProduct = async (ctx: Context, next: Next, joiOptions: ValidationOptions): Promise<void> => {
    const product: Product = ctx.request.body.product;
    if (!product) {
        ctx.throwBadRequest('Received undefined product in request body');
    }
    const { error } = productValidationSchema.validate(product, joiOptions);
    if (error) {
        ctx.throwInvalidProductStructure(error.message);
    }
    return await next();
}