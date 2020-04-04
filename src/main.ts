import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as response from 'koa-respond';
import * as mongoose from 'mongoose';
import * as config from '../config/env/config.json';
import { productRoutes } from './routes/product.routes';
import { logger } from '../config/winston/winston';

const app = new Koa();
app
    .use(response())
    .use(bodyParser())
    .use(productRoutes.routes());

listen();

function listen() {
    app.listen(config.port);
    logger.info('server is up and listen on port ' + config.port);
    connectToDB();
}

function connectToDB() {
    logger.info('trying to connect to DB');
    mongoose.connection
        .on('error', logger.error)
        // TODO: check db retry connection
        .on('disconnected', retryConnection)
        .once('open', () => logger.info('connection establish to DB'));
    return mongoose.connect(config.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
}

function retryConnection() {
    logger.info('retrying to connect to DB');
    connectToDB();
}
