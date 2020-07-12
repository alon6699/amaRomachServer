import { gql, Config } from "apollo-server";
import { DocumentNode } from "graphql";
import { registerNewCart } from "../cart/cart";
import { productsResolvers } from "./product/product.resolver";
import { productsSchema } from "./product/product.schema";
import { ProductTypeDef } from "./product/product.types.schema";
import * as cookie from 'cookie';

const baseSchema: DocumentNode = gql`
  type Query
  type Mutation
  type Subscription
`

export const apolloServerConfig: Config = {
    typeDefs: [baseSchema, productsSchema, ProductTypeDef],
    resolvers: productsResolvers,
    // context: (context) => {
    //     if (context.ctx) {
    //         const userId: string = context.ctx.cookies.get('userId.sig');
    //         registerNewCart(userId);
    //         return { userId }
    //     }
    // },
    subscriptions: {
        onConnect: (x, y, context) => {
            if (context) {
                const userId: string = cookie.parse(context.request.headers.cookie)['userId.sig'];
                registerNewCart(userId);
                return { userId }
            }
        }
    }
}

