import { startSession, DocumentQuery, ClientSession } from 'mongoose';
import { ProductSchema } from "./schemas/product.schema";
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
    const session: ClientSession = await startSession();
    try {
        session.startTransaction();
        await Promise.all(Object.keys(cart).map(async (id: string) =>
            await buyProduct(id, cart[id], session)
        ));
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

const buyProduct = async (id: string, amount: number, session: ClientSession): Promise<Product> => {
    const product: Product = await findProductQuery(id, null, { session: session });
    if (product.limit) {
        const productLimit = product.limit;
        product.limit -= amount;
        return product.save().catch(error => {
            if (error.errors['limit']) {
                throw new Error(`product ${product.id} amount ${amount} is bigger than product's stock ${productLimit}`);
            }
            throw error;
        });
    } else if (product.limit === 0) {
        throw new Error(`try to buy out of stock product ${id}`);
    }
}
