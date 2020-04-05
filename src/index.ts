import * as init from './init'; 
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as response from 'koa-respond';
import * as  nconf from 'nconf';

import { logger } from './logger/logger';
import { connectToDB } from './database';
import { productRoutes } from './routes/product.routes';

init;

const app: Koa = new Koa();
app
    .use(response())
    .use(bodyParser())
    .use(productRoutes.routes());

listen();

function listen() {
    const port: number = nconf.get('port');
    app.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}
