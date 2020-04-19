import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as nconf from 'nconf';
import * as socket from 'socket.io';
import * as  http from 'http';

import { connectToDB } from './database/database';
import { logger } from './logger/logger';
import { errorMiddleware } from './middleware/errors/errors-handler.middleware';
import { loggerMiddleware } from './middleware/logger/logger.middleware';
import { respondOptions } from './middleware/models/koa-respond.model';
import { productRoutes } from './routes/product.routes.middleware';
import { manageProductInCart, checkout, removeSocket, registerSocket } from './socket-io/socket-io';

const app: Koa = new Koa();

app
    .use(errorMiddleware())
    .use(respond(respondOptions))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(productRoutes.routes());

const server = http.createServer(app.callback())

export const webSocket = socket(server);

webSocket.use(registerSocket);

webSocket.on('connection', socket => {
    socket.on('manageProductInCart', manageProductInCart(socket));
    socket.on('checkout', checkout(socket));
    socket.on('disconnect', removeSocket(socket));
});

const listen = () => {
    const port: number = nconf.get('port');
    server.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}

listen();
