import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: String,
        description: String,
        price: {
            type: Number,
            min: 0
        },
        image: String,
        limit: {
            type: Number,
            min: 0
        }
    }
);

export const Product =  model('Product', productSchema);