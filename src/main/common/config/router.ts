import { Application, NextFunction, Request, Response } from 'express';
import TYPES from '../constant/bindingTypes';
import { StudentController } from '../../controller/StudentController';
import containerConfig from './container';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const studentController: StudentController = containerConfig.get<StudentController>(TYPES.StudentController);

export const routerConfig = (app: Application): void => {
  app.post('/api/students', asyncRouterWrapper(studentController.createStudent.bind(studentController)));
};

const asyncRouterWrapper = (fn: (
  arg0: Request<ParamsDictionary, any, any, ParsedQs>,
  arg1: Response,
  arg2: NextFunction,
) => Promise<any>) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => await fn(req, res, next).catch(next);
