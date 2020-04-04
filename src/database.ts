import { connection, connect } from 'mongoose';
import { dbConnectionString } from '../config/env/config.json';
import { logger } from '../config/winston/winston';

export function connectToDB() {
    logger.info('trying to connect to DB');
    connection
        .on('error', logger.error)
        // TODO: check db retry connection
        .on('disconnected', retryConnection)
        .once('open', () => logger.info('connection establish to DB'));
    return connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
}

function retryConnection() {
    logger.info('retrying to connect to DB');
    connectToDB();
}