import { getCart, updateProductInCart, calculateProductLimit, resetCart } from "../../cart/cart";
import { checkoutQuery, createProductQuery, deleteProductQuery, findProductQuery, getProductsQuery, updateProductQuery } from "../../database/product.queries";
import { pubSub } from "../..";
import { Product } from "../../models/product.model";

export const PRODUCT_UPDATES: string = 'productsUpdates';

const productUpdatesSideEffect = (product: Product, deleted: boolean = false) => {
    product.deleted = deleted;
    pubSub.publish(PRODUCT_UPDATES, { productUpdates: product });
    return product;
};

const updateProductInCartHelper = (product: Product) =>
    product.limit !== undefined ? productUpdatesSideEffect(product) : product;

const checkoutHandler = (userId: string) =>
    checkoutQuery(getCart(userId))
        .then(() => {
            resetCart(userId);
            return true;
        })

export const productsResolvers = {
    Query: {
        getProducts: () => getProductsQuery(),
        getProduct: (_, { id }) => findProductQuery(id)
    },
    Mutation: {
        createProduct: (_, { product }) => createProductQuery(product).then(productUpdatesSideEffect),
        updateProduct: (_, { id, product }) => updateProductQuery(id, product).then(productUpdatesSideEffect),
        deleteProduct: (_, { id }) => deleteProductQuery(id).then(product => productUpdatesSideEffect(product, true)),
        updateProductInCart: async (_, { id, amount }, { userId }) =>
            updateProductInCart(userId, id, amount).then(updateProductInCartHelper),
        checkout: async (_, { }, { userId }) => checkoutHandler(userId)
    },
    Subscription: {
        productUpdates: {
            subscribe: () => pubSub.asyncIterator([PRODUCT_UPDATES]),
        },
    },
    Product: {
        limit: (product: Product) => calculateProductLimit(product._id, product.limit),
        deleted: (product: Product) => !!product.deleted
    }
};
