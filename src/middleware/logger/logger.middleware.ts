import { Context } from "vm";
import { Next } from "koa";
import { logger } from "../../logger/logger";

export const loggerMiddleware = () => {
    return async (ctx: Context, next: Next) => {
        logger.info(`received request from url ${ctx.url}`);
        await next();
        const message = `response status ${ctx.status}, data: ${ctx.message}`;
        ctx.status >= 400 ? logger.error(message) : logger.info(message)
    };
}
