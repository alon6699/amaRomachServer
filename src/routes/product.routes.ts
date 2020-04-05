import * as Router from "koa-router";
import { deleteProduct, createProduct, updateProduct, getProducts, findProduct } from "../controllers/product.controller";

export const productRoutes: Router = new Router();

productRoutes.get("/products", getProducts);
productRoutes.get("/products/:name", findProduct);
productRoutes.put("/products",updateProduct);
productRoutes.post("/products", createProduct);
productRoutes.delete("/products/:name", deleteProduct);