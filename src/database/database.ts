import * as mongoose from 'mongoose';
import * as  nconf from 'nconf';

import { logger } from '../logger/logger';

export const connectToDB = () => {
    logger.info('Trying to connect to DB');
    mongoose.connect(nconf.get('db:url'), nconf.get('db:options')).catch(logger.error);
}

const retryConnection = () => {
    logger.info('Retrying to reconnect to DB');
    connectToDB();
}

mongoose.set('bufferCommands', false);
mongoose.connection
    .on('error', logger.error)
    .on('disconnected', retryConnection)
    .once('connected', () => logger.info('MongoDB connected!'))
    .once('open', () => logger.info('MongoDB connection opened'));
