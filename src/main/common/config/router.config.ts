import { Application } from 'express';
import TYPES from '../type/types';
import { StudentController } from '../../controller/student.controller';
import container from './ioc.config';
import { doAsync } from '../util/async-router.util';

const studentController: StudentController = container.get<StudentController>(TYPES.StudentController);

export const routerConfig = (app: Application): void => {
  app.post('/api/students', doAsync(studentController.createStudent.bind(studentController)));
};
