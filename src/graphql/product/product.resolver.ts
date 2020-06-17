import { getCart, updateProductInCart } from "../../cart/cart";
import { checkoutQuery, createProductQuery, deleteProductQuery, findProductQuery, getProductsQuery, updateProductQuery } from "../../database/product.queries";
import { logger } from "../../logger/logger";

export const productsResolvers = {
    Query: {
        getProducts: () => getProductsQuery(),
        getProduct: (_, { id }) => findProductQuery(id)
    },
    Mutation: {
        createProduct: (_, { product }) => createProductQuery(product),
        updateProduct: (_, { id, product }) => updateProductQuery(id, product),
        deleteProduct: (_, { id }) => deleteProductQuery(id),
        updateProductInCart: async (_, { id, amount }, { userId }) => updateProductInCart(userId, id, amount),
        checkout: async (_, { }, { userId }) => {
            try {
                await checkoutQuery(getCart(userId));
            } catch (e) {
                logger.error(e.message);
                return false;
            }
            return true;
        }
    }
};