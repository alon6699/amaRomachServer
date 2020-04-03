import * as winstonConfig from './winston.config.json';
import * as winston from 'winston';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File(winstonConfig.file),
        new winston.transports.Console(winstonConfig.console)
    ],
    exitOnError: false,
});