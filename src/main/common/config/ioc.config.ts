import { Container } from 'inversify';
import { StudentController } from '../../controller/student.controller';
import { StudentService } from '../../service/student.service';
import { StudentRepository } from '../../repository/student.repository';
import TYPES from '../type/types';

const container: Container = new Container({ defaultScope: 'Singleton' });
container.bind<StudentController>(TYPES.StudentController).to(StudentController);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);
container.bind<StudentRepository>(TYPES.StudentRepository).to(StudentRepository);

export default container;
