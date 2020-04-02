import * as koa from 'koa';
import { model } from "mongoose";
import { productSchema } from "../schemas/product.schema";

export const Product = model('Product', productSchema);

export const products = async (ctx: koa.Context) => {
    ctx.body = 'products';
    Product.find().then(products => {
        ctx.body = products;
    }).catch(e => console.log('error ', e));
}

export const getAllProductByName = async (ctx: koa.Context) => {
    ctx.body = ctx.request.querystring;
    Product.findOne({ 'name': ctx.querystring }).then(product => {
        ctx.body = product;
    }).catch(e => console.log('error ', e));
}

    