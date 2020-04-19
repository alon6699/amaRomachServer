import { startSession, DocumentQuery } from 'mongoose';
import { ProductSchema } from "../schemas/product.schema";
import { Product } from '../models/product.model';
import { logger } from '../logger/logger';

export const getProductsQuery = async (): Promise<Product[]> =>
    ProductSchema.find();

export const findProductQuery = async (id: string, projection?: any, options?: any): DocumentQuery<Product, Product> =>
    ProductSchema.findOne({ '_id': id }, projection, options);

export const updateProductQuery = async (id: string, product: Product): DocumentQuery<Product, Product> =>
    ProductSchema.findOneAndUpdate({ _id: id }, product, { new: true });

export const createProductQuery = async (product: Product): DocumentQuery<Product, Product> =>
    ProductSchema.create(product);

export const deleteProductQuery = async (id: string): DocumentQuery<Product, Product> =>
    ProductSchema.findOneAndDelete({ '_id': id });

export const checkoutQuery = async (cart: Record<string, number>) => {
    const session = await startSession();
    try {
        session.startTransaction();
        await Promise.all(Object.keys(cart).map(async (id) => {
            const product: Product = await findProductQuery(id, null, { session: session });
            if (product.limit) {
                product.limit -= cart[id] * 2;
                const validation = product.validateSync();
                if (!validation) {
                    await product.save();
                } else {
                    throw new Error(`can't buy product ${id} Error: ${validation.errors['limit'].message}`);
                }
            } else if (product.limit === 0) {
                throw new Error(`try to update limit out of stock product ${id}`);
            }
        }));
        logger.info(`checkout done successfully ${JSON.stringify(cart)}`);
        await session.commitTransaction();
    }
    catch (e) {
        await session.abortTransaction();
        logger.error(e.message);
        throw e;
    }
    finally {
        session.endSession();
    }
}
