import { Container } from 'inversify';
import { StudentController } from '../../controller/StudentController';
import { StudentFacade } from '../../facade/StudentFacade';
import { StudentRepository } from '../../repository/StudentRepository';
import { ConnectionPool } from './DatabaseConfig';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureRepository } from '../../repository/LectureRepository';
import { LectureFacade } from '../../facade/LectureFacade';
import { LectureController } from '../../controller/LectureController';
import { InstructorRepository } from '../../repository/InstructorRepository';
import { LectureStudentCountRepository } from '../../repository/LectureStudentCountRepository';
import { EnrollmentRepository } from '../../repository/EnrollmentRepository';
import { EnrollmentController } from '../../controller/EnrollmentController';
import { EnrollmentFacade } from '../../facade/EnrollmentFacade';
import { StudentService } from '../../service/StudentService';
import { LectureService } from '../../service/LectureService';
import { EnrollmentService } from '../../service/EnrollementSerivce';
import { InstructorService } from '../../service/InstructorService';

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
