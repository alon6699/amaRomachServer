import * as Router from "koa-router";
import * as productsController from '../controllers/product.controller';

export const productRoutes: Router = new Router();

productRoutes.get("/products", productsController.getProducts);
productRoutes.get("/products/:name", productsController.findProduct);
productRoutes.put("/products", productsController.updateProduct);
productRoutes.post("/products", productsController.addProduct);
productRoutes.delete("/products/:name", productsController.deleteProduct);