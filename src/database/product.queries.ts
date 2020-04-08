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

