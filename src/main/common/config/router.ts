import { Application, NextFunction, Request, Response } from 'express';
import TYPES from '../constant/bindingTypes';
import { StudentController } from '../../controller/StudentController';
import containerConfig from './container';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const studentController: StudentController = containerConfig.get<StudentController>(TYPES.StudentController);

export const routerConfig = (app: Application): void => {
  app.post('/api/students', asyncRouterWrapper(studentController.createStudent.bind(studentController)));
  app.delete('/api/students/:id', asyncRouterWrapper(studentController.deleteStudent.bind(studentController)));
};

const asyncRouterWrapper = (fn: (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
) => Promise<any>) => async (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};
