import 'reflect-metadata';

import { Application } from 'express';
import { Server } from './server';
import * as bodyParser from 'body-parser';
import container from './common/config/ioc.config';
import { routerConfig } from './common/config/router.config';
import { ErrorHandler } from './common/middleware/error-handler.middleware';

const port: string = process.env.PORT || String(3000);
const server: Server = new Server(container);

server.setConfig((app: Application): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  routerConfig(app);
  app.use(ErrorHandler);
});
const app: Application = server.build();

app.listen(port, (): void => {
  console.log(`Server is listening on :${ port }`);
});

