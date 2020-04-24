import { Next, Context } from "koa";
import { logger } from "../../logger/logger";
import { Packet, Socket } from "socket.io";

export const loggerMiddleware = () => {
    return async (ctx: Context, next: Next) => {
        const userId: string = ctx.cookies.get('userId.sig');
        let user: string = userId ? 'user ' + userId : '';
        logger.info(`received request from ${user} url ${ctx.url}`);
        await next();
        const message = `response${user ? ' to ' + user : ''} status ${ctx.status}, body: ${(JSON.stringify(ctx.body))}`;
        ctx.status >= 400 ? logger.error(message) : logger.info(message);
    };
}

export const socketLoggerMiddleware = (socket: Socket) =>
    ([event, data]: Packet, next: (err?: any) => void) => {
        logger.info(`socket ${socket.id} on event ${event} received packet: ${JSON.stringify(data)}`);
        next();
    }
