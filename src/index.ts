import './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as  nconf from 'nconf';

import { logger } from './logger/logger';
import { connectToDB } from './database/database';
import { productRoutes } from './middleware/routes/product.routes.middleware';
import { errorHandlerMiddleware } from './middleware/errors/errors-handler.middleware';
import { loggerMiddleware } from './middleware/logger/logger.middleware';
import { respondOptions } from './middleware/models/koa-respond.model';


const app: Koa = new Koa();
app
    .use(respond(respondOptions))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(errorHandlerMiddleware())
    .use(productRoutes.routes());

const listen = () => {
    const port: number = nconf.get('port');
    app.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}

listen();
