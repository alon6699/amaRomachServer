import { Context, Next } from "koa";
import * as Joi from 'Joi';

import { Product } from "../../models/product.model";

const productValidationSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(1)
        .max(30)
        .required(),
    description: Joi.string()
        .allow(''),
    image: Joi.string(),
    price: Joi.number()
        .min(0),
    limit: Joi.number()
        .min(0)
        .optional()
});

export const validateProductMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    return validateProduct(ctx, next, { abortEarly: false, presence: 'required' });
}

export const validatePartialProductMiddleware = async (ctx: Context, next: Next): Promise<void> => {
    return validateProduct(ctx, next, { abortEarly: false });
}

const validateProduct = async (ctx: Context, next: Next, joiOptions: Joi.ValidationOptions): Promise<void> => {
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