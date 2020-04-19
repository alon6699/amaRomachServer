import * as mongoose from 'mongoose';
import { ProductSchema } from "../schemas/product.schema";
import { Product } from '../models/product.model';

export const getProductsQuery = async (): Promise<Product[]> =>
    ProductSchema.find();

export const findProductQuery = async (id: string): Promise<Product> =>
    ProductSchema.findOne({ '_id': id });

export const updateProductQuery = async (id: string, product: Product): Promise<Product> =>
    ProductSchema.findOneAndUpdate({ _id: id }, product, { new: true });

export const createProductQuery = async (product: Product): Promise<Product> =>
    ProductSchema.create(product);

export const deleteProductQuery = async (id: string): Promise<Product> =>
    ProductSchema.findOneAndDelete({ '_id': id });

export const checkoutQuery = async (cart: Record<string, number>) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await Promise.all(Object.keys(cart).map(async (id) => {
            const product: Product = await ProductSchema.findOne({ '_id': id });
            if(product.limit) {
                product.limit -= cart[id] * 2;
                const validation = product.validateSync();
                if(!validation) {
                    await product.save();
                } else {
                    throw new Error(`can't buy product ${id} Error: ${validation.errors['limit'].message}`);
                }
            } else {
                throw new Error(`try to update limit of unlimited product with id ${id}`);
            }
        }));
        console.log('successfully');
        await session.commitTransaction();
    }
    catch (e) {
        await session.abortTransaction();
        throw e;
    }
    finally {
        session.endSession();
    }
}
