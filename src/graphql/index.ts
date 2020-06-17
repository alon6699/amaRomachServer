import { PubSub, gql } from "apollo-server";
import { addCart } from "../cart/cart";
import { logger } from "../logger/logger";
import { productsResolvers } from "./product/product.resolver";
import { productsSchema } from "./product/product.schema";
import { ProductTypeDef } from "./product/product.types.schema";
import { DocumentNode } from "graphql";

export const pubSub = new PubSub();

const baseTypeDefs: DocumentNode = gql`
  type Query
`

export const apolloServerConfig = {
    typeDefs: [baseTypeDefs, productsSchema, ProductTypeDef],
    resolvers: productsResolvers,
    context: ({ ctx }) => {
        const userId: string = ctx.cookies.get('userId.sig');
        logger.info(`Add new cart to user ${userId}`);
        addCart(userId);
        return { userId: ctx.cookies.get('userId.sig') }
    }
}