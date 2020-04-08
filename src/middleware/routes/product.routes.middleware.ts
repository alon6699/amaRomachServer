import * as Router from "koa-router";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../../controllers/product.controller";
import { validateProductMiddleware, validatePartialProductMiddleware } from "../validation/product.validation.middleware";
import { validateDatabaseConnectionMiddleware } from "../database/database.middleware";

export const productRoutes: Router = new Router({
    prefix: '/products'
});

productRoutes.use(validateDatabaseConnectionMiddleware());

productRoutes.get("/", getProducts);
productRoutes.get("/:id", findProduct);
productRoutes.post("/", validateProductMiddleware, createProduct);
productRoutes.put("/:id", validatePartialProductMiddleware, updateProduct);
productRoutes.delete("/:id", deleteProduct);
