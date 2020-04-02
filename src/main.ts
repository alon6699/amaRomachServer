import * as Koa from 'koa';
import * as mongoose from 'mongoose';
import { devConfig } from '../config/env/dev.config';
import { router } from './routes/routes';

const app = new Koa();

connect();

app.use(router.routes());

function listen() {
    app.listen(devConfig.port);
    console.log('Express app started on port ' + devConfig.port);
  }

function connect() {
    mongoose.connection
      .on('error', console.log)
      .on('disconnected', connect)
      .once('open', listen);
    return mongoose.connect(devConfig.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  }