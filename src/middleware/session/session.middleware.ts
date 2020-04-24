import { Context, Next } from "koa";

// Put some data inside session object to activate it otherwise it is undefined - bug
export const activateSessionMiddleware = async (ctx: Context, next: Next) => {
    ctx.session.count = 0;
    await next();
}
