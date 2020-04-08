import * as Joi from 'Joi';

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
