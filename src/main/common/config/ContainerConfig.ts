import { Container } from 'inversify';
import { StudentController } from '../../controller/StudentController';
import { StudentService } from '../../service/StudentService';
import { StudentRepository } from '../../repository/StudentRepository';
import { ConnectionPool } from './DatabaseConfig';
import { StudentDTOMapper } from '../../mapper/StudentDTOMapper';
import { BindingTypes } from '../constant/BindingTypes';
import { LectureRepository } from '../../repository/LectureRepository';
import { LectureService } from '../../service/LectureService';
import { LectureDTOMapper } from '../../mapper/LectureDTOMapper';
import { LectureController } from '../../controller/LectureController';
import { InstructorRepository } from '../../repository/InstructorRepository';

const container: Container = new Container({ defaultScope: 'Singleton' });

const bindings = [
  { type: BindingTypes.ConnectionPool, to: ConnectionPool },

  // student
  { type: BindingTypes.StudentController, to: StudentController },
  { type: BindingTypes.StudentDTOMapper, to: StudentDTOMapper },
  { type: BindingTypes.StudentService, to: StudentService },
  { type: BindingTypes.StudentRepository, to: StudentRepository },

  // lecture
  { type: BindingTypes.LectureController, to: LectureController },
  { type: BindingTypes.LectureDTOMapper, to: LectureDTOMapper },
  { type: BindingTypes.LectureService, to: LectureService },
  { type: BindingTypes.LectureRepository, to: LectureRepository },

  // instructor
  { type: BindingTypes.InstructorRepository, to: InstructorRepository },
];

bindings.forEach(({ type, to }) => container.bind(type).to(to));

export { container };
