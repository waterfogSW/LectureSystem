import 'reflect-metadata';

import { type Application } from 'express';
import * as bodyParser from 'body-parser';
import { Server } from './server';
import { configureRoutes } from './common/config/RouteConfig';
import { ExceptionHandler } from './common/middleware/ExceptionHandler';
import { container } from './common/config/ContainerConfig';

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
  // eslint-disable-next-line no-console
  console.log(`Server is listening on :${ port }`);
});
