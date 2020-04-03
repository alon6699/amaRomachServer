import { Schema } from 'mongoose';

export const productSchema = new Schema(
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
    },
    {
        versionKey: false
    }
);
