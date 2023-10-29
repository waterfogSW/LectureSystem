import { Application, NextFunction, Request, Response } from 'express';
import { StudentController } from '../../controller/StudentController';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { container } from './ContainerConfig';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureController } from '../../controller/LectureController';

const studentController: StudentController = container.get<StudentController>(BindingTypes.StudentController);
const lectureController: LectureController = container.get<LectureController>(BindingTypes.LectureController);
export const configureRoutes = (app: Application): void => {
  // student
  app.post('/api/students', withAsync(studentController.createStudent.bind(studentController)));
  app.delete('/api/students/:id', withAsync(studentController.deleteStudent.bind(studentController)));

  // lecture
  app.post('/api/lectures', withAsync(lectureController.createLecture.bind(lectureController)));
  app.get('/api/lectures', withAsync(lectureController.listLecture.bind(lectureController)));
  app.post('/api/lectures/bulk', withAsync(lectureController.createLectureBulk.bind(lectureController)));
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
