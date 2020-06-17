import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as nconf from 'nconf';
import * as socket from 'socket.io';
import * as http from 'http';
import * as cors from '@koa/cors';
import * as session from 'koa-session';
import { ApolloServer} from "apollo-server-koa";

import { connectToDB } from './database/database';
import { logger } from './logger/logger';
import { errorMiddleware } from './http/middleware/errors/errors-handler.middleware';
import { loggerMiddleware } from './http/middleware/logger/logger.middleware';
import { respondOptions } from './http/middleware/models/koa-respond.model';
import { productRoutes } from './http/routes/product.routes.middleware';
import { updateProductInCartSocket, removeSocket } from './web-socket/web-socket';
import { activateSessionMiddleware } from './http/middleware/session/session.middleware';
import { socketLoggerMiddleware, registerSocket } from './web-socket/middleware/web-socket.middleware';
import { apolloServerConfig } from './graphql';

const app: Koa = new Koa();

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

const apolloServer = new ApolloServer(apolloServerConfig);
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
