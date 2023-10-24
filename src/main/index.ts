import 'reflect-metadata';

import { Application } from 'express';
import { Server } from './server';
import * as bodyParser from 'body-parser';
import container from './common/config/ioc.config';
import { StudentController } from './controller/student.controller';
import TYPES from './common/type/types';

const port: string = process.env.PORT || String(3000);
const server: Server = new Server(container);

server.setConfig((app: Application): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const studentController: StudentController = container.get<StudentController>(TYPES.StudentController);
  app.post('/api/students', studentController.createStudent.bind(studentController));
});
const app: Application = server.build();

app.listen(port, (): void => {
  console.log(`Server is listening on :${ port }`);
});

