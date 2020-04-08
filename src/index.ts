import * as init from './init';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import * as  nconf from 'nconf';

import { logger, loggerMiddleware } from './logger/logger';
import { connectToDB } from './database/database';
import { productRoutes } from './routes/product.routes';

init;

const app: Koa = new Koa();
app
    .use(respond({
        methods: {
            throwBadRequest: (ctx, message) => {
                ctx.throw(400, message);
            },
            throwNotFound: (ctx, message) => {
                ctx.throw(404, message);
            }
        }
    }))
    .use(bodyParser())
    .use(loggerMiddleware())
    .use(async (ctx: Koa.Context, next: Koa.Next) => {
        try {
            await next();
        } catch (error) {
            if (error.name === 'ValidationError') {
                ctx.badRequest(`Invalid product structure ${error.message}`);
            }
            logger.error(`response ${error.status || ctx.status} ${error.message}`);
        }
    })
    .use(productRoutes.routes());

const listen = () => {
    const port: number = nconf.get('port');
    app.listen(port, () => {
        logger.info('Server is up and listen on port ' + port);
        connectToDB();
    });
}

listen();
