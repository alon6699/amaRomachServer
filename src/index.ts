import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as nconf from 'nconf';
import * as socket from 'socket.io';
import * as http from 'http';
import * as cors from '@koa/cors';

import { connectToDB } from './database/database';
import { logger } from './logger/logger';
import { errorMiddleware } from './middleware/errors/errors-handler.middleware';
import { loggerMiddleware, socketLoggerMiddleware } from './middleware/logger/logger.middleware';
import { respondOptions } from './middleware/models/koa-respond.model';
import { productRoutes } from './http/routes/product.routes.middleware';
import { manageProductInCart as updateProductInCart, removeSocket, registerSocket } from './web-socket/web-socket';

const app: Koa = new Koa();
app
    .use(errorMiddleware())
    .use(cors({ credentials: true }))
    .use(respond(respondOptions))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(productRoutes.routes());

const server = http.createServer(app.callback());

export const webSocket = socket(server);
webSocket.use(registerSocket);
webSocket.on('error', logger.error);
webSocket.on('connection', (socket: socket.Socket) => {
    socket.use(socketLoggerMiddleware(socket));
    socket.on('manageProductInCart', updateProductInCart(socket.id));
    socket.on('disconnect', removeSocket(socket));
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
