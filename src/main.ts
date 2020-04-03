import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as response from 'koa-respond';
import * as mongoose from 'mongoose';
import * as config from '../config/env/config.json';
import { router } from './routes/routes';
import { logger } from '../config/winston/winston';

const app = new Koa();
app
    .use(response())
    .use(bodyParser())
    .use(router.routes());

connect();

function connect() {
    logger.info('trying to connect to DB');
    mongoose.connection
        .on('error', logger.error)
        .on('disconnected', retryConnection)
        .once('open', listen);
    return mongoose.connect(config.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
}

function listen() {
    logger.info('connection establish to DB');
    app.listen(config.port);
    logger.info('server is up and listen on port ' + config.port);
}

function retryConnection() {
    logger.info('retrying to connect to DB');
    connect();
}



