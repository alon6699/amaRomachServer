import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as nconf from 'nconf';
import * as socket from 'socket.io';
import * as http from 'http';
import * as cors from '@koa/cors';
import * as session from 'koa-session';
import { ApolloServer, PubSub, gql } from "apollo-server-koa";

import { connectToDB } from './database/database';
import { logger } from './logger/logger';
import { errorMiddleware } from './http/middleware/errors/errors-handler.middleware';
import { loggerMiddleware } from './http/middleware/logger/logger.middleware';
import { respondOptions } from './http/middleware/models/koa-respond.model';
import { productRoutes } from './http/routes/product.routes.middleware';
import { updateProductInCartSocket, removeSocket } from './web-socket/web-socket';
import { activateSessionMiddleware } from './http/middleware/session/session.middleware';
import { socketLoggerMiddleware, registerSocket } from './web-socket/middleware/web-socket.middleware';
import { getProductsQuery, findProductQuery, createProductQuery, updateProductQuery, deleteProductQuery, checkoutQuery } from './database/product.queries';
import { getCart, addCart, updateProductInCart } from './cart/cart';

const app: Koa = new Koa();

export const pubSub = new PubSub();

const typeDefs = gql`
  type Query {
    getProducts: [Product]
    getProduct(id: String!): Product
  }
  
  type Mutation {
    createProduct(product: ProductInput!): Product
    updateProduct(id: String!, product: productUpdateInput!): Product
    deleteProduct(id: String!): Product
    updateProductInCart(id: String!, amount: Int!): Product
    checkout: Boolean
  }

  type Product {
    id: String!
    name: String!
    description: String
    price: Int
    image: String
    limit: Int
  }

  input productUpdateInput {
    name: String
    description: String
    price: Int
    image: String
    limit: Int
  }

  input ProductInput {
    name: String!
    description: String!
    price: Int!
    image: String!
    limit: Int!
  }
`;

const resolvers = {
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

app.keys = ['secret'];
app
    .use(errorMiddleware())
    .use(cors({ credentials: true }))
    .use(session({ key: 'userId' }, app))
    .use(activateSessionMiddleware)
    .use(respond(respondOptions))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(productRoutes.routes());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ ctx }) => {
        const userId: string = ctx.cookies.get('userId.sig');
        logger.info(`Add new cart to user ${userId}`);
        addCart(userId);
        return { userId: ctx.cookies.get('userId.sig') }
    }
});
apolloServer.applyMiddleware({ app, cors: { credentials: true } });

const server = http.createServer(app.callback());

export const webSocket = socket(server);
webSocket.use(registerSocket);
webSocket.on('error', logger.error);
webSocket.on('connection', (socket: socket.Socket) => {
    socket.use(socketLoggerMiddleware(socket));
    socket.on('updateProductInCart', updateProductInCartSocket(socket.id));
    socket.on('disconnect', removeSocket(socket.id));
    socket.on('error', logger.error);
});

const listen = () => {
    const port: number = nconf.get('port');
    server.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}

listen();
