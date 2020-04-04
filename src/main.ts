import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as response from 'koa-respond';

import { logger } from '../config/winston/winston';
import { connectToDB } from './database';
import { productRoutes } from './routes/product.routes';
import * as  nconf from 'nconf';

nconf.argv().env().file({file: 'src/../config/env/config.json'});

const app: Koa = new Koa();
app
    .use(response())
    .use(bodyParser())
    .use(productRoutes.routes());

listen();

function listen() {
    const port: number = nconf.get('port');
    app.listen(port);
    logger.info('Server is up and listen on port ' + port);
    connectToDB();
}
