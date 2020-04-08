import { Context } from "koa";

export const respondOptions = {
    methods: {
        throwBadRequest: (ctx: Context, message: string) => {
            ctx.status = 400;
            ctx.throw(400, message);
        },
        throwNotFound: (ctx: Context, message: string) => {
            ctx.status = 404;
            ctx.throw(404, message);
        }
    }
}