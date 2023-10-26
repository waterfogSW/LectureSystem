import { Container } from 'inversify';
import { StudentController } from '../../controller/StudentController';
import { StudentService } from '../../service/StudentService';
import { StudentRepository } from '../../repository/StudentRepository';
import { ConnectionPool } from './DatabaseConfig';
import { StudentDTOMapper } from '../../mapper/StudentDTOMapper';
import { BindingTypes } from '../constant/BindingTypes';

const container: Container = new Container({ defaultScope: 'Singleton' });

const bindings = [
  { type: BindingTypes.ConnectionPool, to: ConnectionPool },
  { type: BindingTypes.StudentController, to: StudentController },
  { type: BindingTypes.StudentDTOMapper, to: StudentDTOMapper },
  { type: BindingTypes.StudentService, to: StudentService },
  { type: BindingTypes.StudentRepository, to: StudentRepository },
];

bindings.forEach(({ type, to }) => container.bind(type).to(to));

export { container };
