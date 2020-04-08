import { Next, Context } from "koa";

import { logger } from "../../logger/logger";

export const errorHandlerMiddleware = () => {
    return async (ctx: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            if (error.name === 'ValidationError') {
                ctx.badRequest(`Invalid product structure ${error.message}`);
            }
            logger.error(`Error ${error.status || ctx.status} ${error.message}`);
        }
    }
}
