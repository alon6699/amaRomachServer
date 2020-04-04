import * as Joi from 'Joi';

export const productValidationSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(1)
        .max(30)
        .required(),
    description: Joi.string()
        .allow('')
        .required(),
    image: Joi.string()
        .required(),
    price: Joi.number()
        .min(0)
        .required(),
    limit: Joi.number()
        .min(0)
});