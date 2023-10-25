import 'reflect-metadata';

import { Application } from 'express';
import { Server } from './server';
import * as bodyParser from 'body-parser';
import containerConfig from './common/config/container';
import { routerConfig } from './common/config/router';
import { ErrorHandler } from './common/middleware/ErrorHandler';

const port: string = process.env.PORT || String(3000);
const server: Server = new Server(containerConfig);

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

