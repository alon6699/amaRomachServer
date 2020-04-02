import * as Router from "koa-router"
import * as productsController from '../controllers/product.controller'

export const router = new Router()

router.get("/products", productsController.products)
router.get("/products/:name", productsController.getAllProductByName)