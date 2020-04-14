import * as Router from "koa-router";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../controllers/product.controller";
import { validateProductMiddleware, validatePartialProductMiddleware } from "../middleware/validation/product.validation.middleware";
import { validateDatabaseConnectionMiddleware } from "../middleware/database/database.middleware";
import { productChangesMiddleware, calculateProductLimit } from "../web-socket/web-sokcet";
import { Context, Next } from "koa";
import { isArray } from "util";
import { Product } from "../models/product.model";

export const productRoutes: Router = new Router({
    prefix: '/products'
});

productRoutes.use(validateDatabaseConnectionMiddleware());

export const changeProductLimit = async (ctx: Context, next: Next): Promise<void> => {
    const data: Product | Product[] = ctx.body;
    isArray(data) ?
        data.filter(product => product.limit).forEach(product => product.limit -= calculateProductLimit(product.id)) :
        data.limit -= calculateProductLimit(data.id);
    ctx.ok(data);
    await next();
}

productRoutes.get("/", getProducts, changeProductLimit);
productRoutes.get("/:id", findProduct, changeProductLimit);
productRoutes.post("/", validateProductMiddleware, createProduct);
productRoutes.put("/:id", validatePartialProductMiddleware, updateProduct, productChangesMiddleware(false));
productRoutes.delete("/:id", deleteProduct, productChangesMiddleware(true));
