import * as mongoose from 'mongoose';
import { logger } from '../config/winston/winston';
import * as  nconf from 'nconf';

export function connectToDB() {
    logger.info('Trying to connect to DB');
    mongoose.connect(nconf.get('db:url'), nconf.get('db:options')).catch(logger.error);
}

mongoose.set('bufferCommands', false);
mongoose.connection
    .on('error', logger.error)
    .on('disconnected', retryConnection)
    .once('connected', () => logger.info('MongoDB connected!'))
    .once('open', () => logger.info('MongoDB connection opened'));

function retryConnection() {
    logger.info('Retrying to reconnect to DB');
    connectToDB();
}