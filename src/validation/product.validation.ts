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

export const validateProduct = (product: Product): Joi.ValidationResult<Product> => {
    return productValidationSchema.validate(product, { abortEarly: false, presence: 'required' });
}

export const validatePartialProduct = (product: Partial<Product>): Joi.ValidationResult<Partial<Product>> => {
    return productValidationSchema.validate(product, { abortEarly: false });
}
