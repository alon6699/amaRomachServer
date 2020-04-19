import * as Router from "koa-router";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../controllers/product.controller";
import { validateProductMiddleware, validatePartialProductMiddleware } from "../middleware/validation/product.validation.middleware";
import { validateDatabaseConnectionMiddleware } from "../middleware/database/database.middleware";
import { changeProductClientLimitMiddleware, productChangesMiddleware } from "./product.middleware";

export const productRoutes: Router = new Router({
    prefix: '/products'
});

productRoutes.use(validateDatabaseConnectionMiddleware());

productRoutes.get("/", getProducts, changeProductClientLimitMiddleware);
productRoutes.get("/:id", findProduct, changeProductClientLimitMiddleware);
productRoutes.post("/", validateProductMiddleware, createProduct, productChangesMiddleware(false));
productRoutes.put("/:id", validatePartialProductMiddleware, updateProduct, productChangesMiddleware(false));
productRoutes.delete("/:id", deleteProduct, productChangesMiddleware(true));
