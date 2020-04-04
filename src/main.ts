import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as response from 'koa-respond';
import { port } from '../config/env/config.json';
import { productRoutes } from './routes/product.routes';
import { logger } from '../config/winston/winston';
import { connectToDB } from './database';

const app: Koa = new Koa();
app
    .use(response())
    .use(bodyParser())
    .use(productRoutes.routes());

listen();

function listen() {
    app.listen(port);
    logger.info('server is up and listen on port ' + port);
    connectToDB();
}
