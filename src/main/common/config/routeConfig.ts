import { Application, NextFunction, Request, Response } from 'express';
import TYPES from '../constant/bindingTypes';
import { StudentController } from '../../controller/StudentController';
import containerConfig from './container';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const studentController: StudentController = containerConfig.get<StudentController>(TYPES.StudentController);

export const configureRoutes = (app: Application): void => {
  app.post('/api/students', withAsync(studentController.createStudent.bind(studentController)));
  app.delete('/api/students/:id', withAsync(studentController.deleteStudent.bind(studentController)));
};

type asyncRouterFunction = (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const withAsync = (targetFunction: asyncRouterFunction) => async (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await targetFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};
