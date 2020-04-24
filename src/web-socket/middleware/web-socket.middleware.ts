import { Socket, Packet } from "socket.io";
import * as cookie from 'cookie';

import { logger } from "../../logger/logger";
import { addCart } from "../../cart/cart";

export const registerSocket = (socket: Socket, next: (err?: Error) => void) => {
    socket.id = cookie.parse(socket.request.headers.cookie)['userId.sig'];
    logger.info(`A user connected ${socket.id}`);
    addCart(socket.id);
    next();
}

export const socketLoggerMiddleware = (socket: Socket) =>
    ([event, data]: Packet, next: (err?: any) => void) => {
        logger.info(`socket ${socket.id} on event ${event} received packet: ${JSON.stringify(data)}`);
        next();
    }