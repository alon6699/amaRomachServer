import * as Router from "koa-router";
import { connection } from 'mongoose';
import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../controllers/product.controller";

export const productRoutes: Router = new Router({
    prefix: '/products'
  });

productRoutes.use(async (ctx, next) => {
    if(connection.readyState !== 1) {
        ctx.throw(500,'database is not connected');
    }
    await next();
});

productRoutes.get("/", getProducts);
productRoutes.post("/", createProduct);
productRoutes.get("/:id", findProduct);
productRoutes.put("/:id",updateProduct);
productRoutes.delete("/:id", deleteProduct);