import { Context, Next } from "koa";

// Put some data inside session object to activate it otherwise it is undefined - bug
export const sessionMiddleware = async (ctx: Context, next: Next) => {
    ctx.session.isNew = true;
    await next();
}
