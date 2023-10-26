import 'reflect-metadata';

import { type Application } from 'express';
import { Server } from './server';
import * as bodyParser from 'body-parser';
import { configureRoutes } from './common/config/routeConfig';
import { ExceptionHandler } from './common/middleware/ExceptionHandler';
import { container } from './common/config/containerConfig';

const port: string = process.env.PORT || String(3000);
const server: Server = new Server(container);

server.setConfig((app: Application): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  configureRoutes(app);
  app.use(ExceptionHandler);
});
const app: Application = server.build();

app.listen(port, (): void => {
  console.log(`Server is listening on :${ port }`);
});
