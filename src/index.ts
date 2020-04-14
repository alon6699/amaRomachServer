import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as nconf from 'nconf';
import * as socket from 'socket.io';

import { connectToDB } from './database/database';
import { logger } from './logger/logger';
import { errorMiddleware } from './middleware/errors/errors-handler.middleware';
import { loggerMiddleware } from './middleware/logger/logger.middleware';
import { respondOptions } from './middleware/models/koa-respond.model';
import { productRoutes } from './routes/product.routes.middleware';
import { cart, manageProductInCart, checkout } from './web-socket/web-sokcet';


const app: Koa = new Koa();

export const webSocket = socket(app);
webSocket.on('connection', socket => {
    cart[socket.id] = {};
    socket.on('manageProductInCart', manageProductInCart(socket));
    socket.on('checkout', checkout(socket));
});

app
    .use(errorMiddleware())
    .use(respond(respondOptions))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(productRoutes.routes());

const listen = () => {
    const port: number = nconf.get('port');
    app.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}

listen();
