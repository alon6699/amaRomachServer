import { Schema, Model, model } from 'mongoose';
import { Product } from '../../models/product.model';

const productSchema: Schema<Product> = new Schema(
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

export const ProductSchema: Model<Product> = model<Product>('Product', productSchema);
