import * as Joi from 'Joi';
import { Product } from '../models/product.model';

export const productValidationSchema: Joi.ObjectSchema = Joi.object({
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

export const validateProduct = (product: Product): Product => {
    const { error, value } = productValidationSchema.validate(product, { abortEarly: false, presence: 'required' });
    return handleValidation(value, error);
}

export const validatePartialProduct = (product: Partial<Product>): Partial<Product> => {
    const { error, value } = productValidationSchema.validate(product, { abortEarly: false, presence: 'required' });
    return handleValidation(value, error);
}

const handleValidation = <T>(value: T, error: Error): T => {
    if (error) {
        error.message = 'Invalid product structure ' + error.message;
        throw error;
    }
    return value;
}   