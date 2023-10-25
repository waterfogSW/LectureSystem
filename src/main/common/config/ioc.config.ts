import { Container } from 'inversify';
import { StudentController } from '../../controller/student.controller';
import { StudentService } from '../../service/student.service';
import { StudentRepository } from '../../repository/student.repository';
import TYPES from '../type/types';
import { ConnectionPool } from './db.config';
import { StudentDTOMapper } from '../../controller/mapper/StudentDTOMapper';

const container: Container = new Container({ defaultScope: 'Singleton' });
container.bind<ConnectionPool>(TYPES.ConnectionPool).to(ConnectionPool);
container.bind<StudentController>(TYPES.StudentController).to(StudentController);
container.bind<StudentDTOMapper>(TYPES.StudentDTOMapper).to(StudentDTOMapper);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);
container.bind<StudentRepository>(TYPES.StudentRepository).to(StudentRepository);

export default container;
