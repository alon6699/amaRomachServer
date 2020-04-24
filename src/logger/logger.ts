import * as winston from 'winston';
import * as  nconf from 'nconf';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File(nconf.get('logger:file')),
        new winston.transports.Console(nconf.get('logger:console'))
    ],
    exitOnError: false,
});
