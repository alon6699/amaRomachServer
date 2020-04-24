import { Next, Context } from "koa";

import { logger } from "../../../logger/logger";

export const errorMiddleware = () => {
    return async (ctx: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            logger.error(`Error ${error.message}`);
        }
    }
}
