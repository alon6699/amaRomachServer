import * as Router from "koa-router";
import { connection } from 'mongoose';
import { Context, Next } from "koa";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../../controllers/product.controller";

export const productRoutes: Router = new Router({
    prefix: '/products'
});

const checkProductBodyRequest = async (ctx: Context, next: Next) => {
    if (!ctx.request.body.product) {
        ctx.throwBadRequest('Received undefined product in request body');
    }
    await next();
}

productRoutes.use(async (ctx: Context, next: Next) => {
    if (connection.readyState !== 1) {
        ctx.throw(500, 'database is not connected');
    }
    await next();
});

productRoutes.get("/", getProducts);
productRoutes.get("/:id", findProduct);
productRoutes.post("/", checkProductBodyRequest, createProduct);
productRoutes.put("/:id", checkProductBodyRequest, updateProduct);
productRoutes.delete("/:id", deleteProduct);
