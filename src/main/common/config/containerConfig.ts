import { Container } from 'inversify';
import { StudentController } from '../../controller/StudentController';
import { StudentService } from '../../service/StudentService';
import { StudentRepository } from '../../repository/StudentRepository';
import TYPES from '../constant/bindingTypes';
import { ConnectionPool } from './databaseConfig';
import { StudentDTOMapper } from '../../mapper/StudentDTOMapper';

const container: Container = new Container({ defaultScope: 'Singleton' });

const bindings = [
  { type: TYPES.ConnectionPool, to: ConnectionPool },
  { type: TYPES.StudentController, to: StudentController },
  { type: TYPES.StudentDTOMapper, to: StudentDTOMapper },
  { type: TYPES.StudentService, to: StudentService },
  { type: TYPES.StudentRepository, to: StudentRepository },
];

bindings.forEach(({ type, to }) => container.bind(type).to(to));

export default container;
