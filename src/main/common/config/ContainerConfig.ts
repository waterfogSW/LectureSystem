import { Container } from 'inversify';
import { StudentController } from '../../controller/StudentController';
import { StudentService } from '../../service/StudentService';
import { StudentRepository } from '../../repository/StudentRepository';
import { ConnectionPool } from './DatabaseConfig';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureRepository } from '../../repository/LectureRepository';
import { LectureService } from '../../service/LectureService';
import { LectureController } from '../../controller/LectureController';
import { InstructorRepository } from '../../repository/InstructorRepository';
import { LectureStudentCountRepository } from '../../repository/LectureStudentCountRepository';

const container: Container = new Container({ defaultScope: 'Singleton' });

const bindings = [
  { type: BindingTypes.ConnectionPool, to: ConnectionPool },

  // student
  { type: BindingTypes.StudentController, to: StudentController },
  { type: BindingTypes.StudentService, to: StudentService },
  { type: BindingTypes.StudentRepository, to: StudentRepository },

  // lecture
  { type: BindingTypes.LectureController, to: LectureController },
  { type: BindingTypes.LectureService, to: LectureService },
  { type: BindingTypes.LectureRepository, to: LectureRepository },

  // instructor
  { type: BindingTypes.InstructorRepository, to: InstructorRepository },

  // lecture student count
  { type: BindingTypes.LectureStudentCountRepository, to: LectureStudentCountRepository },
];

bindings.forEach(({ type, to }) => container.bind(type).to(to));

export { container };
