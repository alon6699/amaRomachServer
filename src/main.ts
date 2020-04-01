import * as Koa from 'koa';

const db = require('./db/db');
const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);