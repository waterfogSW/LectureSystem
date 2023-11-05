import { Container } from 'inversify';
import { StudentController } from '../../student/controller/StudentController';
import { StudentFacade } from '../../student/facade/StudentFacade';
import { StudentRepository } from '../../student/repository/StudentRepository';
import { ConnectionPool } from './DatabaseConfig';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureRepository } from '../../lecture/repository/LectureRepository';
import { LectureFacade } from '../../lecture/facade/LectureFacade';
import { LectureController } from '../../lecture/controller/LectureController';
import { InstructorRepository } from '../../instructor/repository/InstructorRepository';
import { LectureStudentCountRepository } from '../../lecture/repository/LectureStudentCountRepository';
import { EnrollmentRepository } from '../../enrollment/repository/EnrollmentRepository';
import { EnrollmentController } from '../../enrollment/controller/EnrollmentController';
import { EnrollmentFacade } from '../../enrollment/facade/EnrollmentFacade';
import { StudentService } from '../../student/service/StudentService';
import { LectureService } from '../../lecture/service/LectureService';
import { EnrollmentService } from '../../enrollment/service/EnrollementSerivce';
import { InstructorService } from '../../instructor/service/InstructorService';

const container: Container = new Container({ defaultScope: 'Singleton' });

const bindings = [
  { type: BindingTypes.ConnectionPool, to: ConnectionPool },

  // student
  { type: BindingTypes.StudentController, to: StudentController },
  { type: BindingTypes.StudentFacade, to: StudentFacade },
  { type: BindingTypes.StudentService, to: StudentService },
  { type: BindingTypes.StudentRepository, to: StudentRepository },

  // lecture
  { type: BindingTypes.LectureController, to: LectureController },
  { type: BindingTypes.LectureFacade, to: LectureFacade },
  { type: BindingTypes.LectureService, to: LectureService },
  { type: BindingTypes.LectureRepository, to: LectureRepository },
  { type: BindingTypes.LectureStudentCountRepository, to: LectureStudentCountRepository },

  // instructor
  { type: BindingTypes.InstructorService, to: InstructorService },
  { type: BindingTypes.InstructorRepository, to: InstructorRepository },

  // enrollment
  { type: BindingTypes.EnrollmentController, to: EnrollmentController },
  { type: BindingTypes.EnrollmentFacade, to: EnrollmentFacade },
  { type: BindingTypes.EnrollmentService, to: EnrollmentService },
  { type: BindingTypes.EnrollmentRepository, to: EnrollmentRepository },
];

bindings.forEach(({ type, to }) => container.bind(type).to(to));

export { container };
