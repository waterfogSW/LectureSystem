import { Application } from 'express';
import { Container } from 'inversify';
import { Server } from './server';
import * as bodyParser from 'body-parser';


const port: string = process.env.PORT || String(3000);
const container: Container = new Container();
const server: Server = new Server(container);

server.setConfig((app: Application): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
});
const app: Application = server.build();

app.listen(port, (): void => {
  console.log(`Server is listening on :${ port }`);
});

