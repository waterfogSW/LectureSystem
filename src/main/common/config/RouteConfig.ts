import { Application } from 'express';
import { StudentController } from '../../student/controller/StudentController';
import { container } from './ContainerConfig';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureController } from '../../lecture/controller/LectureController';
import { EnrollmentController } from '../../enrollment/controller/EnrollmentController';
import { withAsyncHandler } from '../util/withAsyncHandler';

const studentController: StudentController = container.get<StudentController>(BindingTypes.StudentController);
const lectureController: LectureController = container.get<LectureController>(BindingTypes.LectureController);
const enrollmentController: EnrollmentController = container.get<EnrollmentController>(BindingTypes.EnrollmentController);
export const configureRoutes = (app: Application): void => {
  // student
  app.post('/api/students', withAsyncHandler(studentController.createStudent.bind(studentController)));
  app.delete('/api/students/:id', withAsyncHandler(studentController.deleteStudent.bind(studentController)));

  // lecture
  app.post('/api/lectures', withAsyncHandler(lectureController.createLecture.bind(lectureController)));
  app.get('/api/lectures', withAsyncHandler(lectureController.listLecture.bind(lectureController)));
  app.post('/api/lectures/bulk', withAsyncHandler(lectureController.createMultipleLectures.bind(lectureController)));
  app.get('/api/lectures/:id', withAsyncHandler(lectureController.detailLecture.bind(lectureController)));
  app.patch('/api/lectures/:id', withAsyncHandler(lectureController.updateLecture.bind(lectureController)));
  app.delete('/api/lectures/:id', withAsyncHandler(lectureController.deleteLecture.bind(lectureController)));
  app.post('/api/lectures/:id/publish', withAsyncHandler(lectureController.publishLecture.bind(lectureController)));

  // enrollment
  app.post('/api/enrollments', withAsyncHandler(enrollmentController.createEnrollment.bind(enrollmentController)));
};

