import * as Router from "koa-router";

import { createProduct, deleteProduct, findProduct, getProducts, updateProduct, checkout } from "../controllers/product.controller";
import { validateProductMiddleware, validatePartialProductMiddleware } from "../../middleware/validation/product.validation.middleware";
import { validateDatabaseConnectionMiddleware } from "../../middleware/database/database.middleware";
import { updateProductLimitMiddleware, productChangesMiddleware, setUserId } from "./product.middleware";

export const productRoutes: Router = new Router({});

productRoutes.use(validateDatabaseConnectionMiddleware);

productRoutes.get("/products", getProducts, updateProductLimitMiddleware, setUserId);
productRoutes.get("/products:id", findProduct, updateProductLimitMiddleware);
productRoutes.post("/products", validateProductMiddleware, createProduct, productChangesMiddleware(false));
productRoutes.put("/products:id", validatePartialProductMiddleware, updateProduct, productChangesMiddleware(false));
productRoutes.delete("/products:id", deleteProduct, productChangesMiddleware(true));
productRoutes.post("/checkout", checkout);
