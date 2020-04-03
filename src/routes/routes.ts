import * as Router from "koa-router";
import * as koa from 'koa';
import * as productsController from '../controllers/product.controller';

export const router = new Router();

router.get("/products", productsController.products);
router.get("/products/:name", productsController.findProduct);
router.put("/products", productsController.updateProduct);
router.post("/products", productsController.addProduct);
router.delete("/products/:name", productsController.deleteProduct);