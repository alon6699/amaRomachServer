import * as Router from "koa-router";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../controllers/product.controller";
import { validateProductMiddleware, validatePartialProductMiddleware } from "../middleware/validation/product.validation.middleware";
import { validateDatabaseConnectionMiddleware } from "../middleware/database/database.middleware";
import { productChangesMiddleware, changeProductLimit } from "../socket-io/socket-io";

export const productRoutes: Router = new Router({
    prefix: '/products'
});

productRoutes.use(validateDatabaseConnectionMiddleware());

productRoutes.get("/", getProducts, changeProductLimit);
productRoutes.get("/:id", findProduct, changeProductLimit);
productRoutes.post("/", validateProductMiddleware, createProduct);
productRoutes.put("/:id", validatePartialProductMiddleware, updateProduct, productChangesMiddleware(false));
productRoutes.delete("/:id", deleteProduct, productChangesMiddleware(true));
