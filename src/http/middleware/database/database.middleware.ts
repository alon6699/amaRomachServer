import { Context, Next } from "koa";
import { connection } from 'mongoose';

export const validateDatabaseConnectionMiddleware = async (ctx: Context, next: Next) => {
    if (connection.readyState !== 1) {
        ctx.throwInternalServerError('database is not connected');
    }
    await next();
}
