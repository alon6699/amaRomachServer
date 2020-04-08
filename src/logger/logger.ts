import * as winston from 'winston';
import * as  nconf from 'nconf';
import { Context, Next } from 'koa';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File(nconf.get('logger:file')),
        new winston.transports.Console(nconf.get('logger:console'))
    ],
    exitOnError: false,
});

export const loggerMiddleware = () => {
    return async (ctx: Context, next: Next) => {
        logger.info(`received request from url ${ctx.url}`);
        await next();
        const message = `response status ${ctx.status}, data: ${ctx.message}`;
        ctx.status >= 400 ? logger.error(message) : logger.info(message)
    };
}
