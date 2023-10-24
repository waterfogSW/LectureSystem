import { Student } from '../model/student.model';
import { injectable } from 'inversify';

@injectable()
export class StudentRepository {
  public async save(student: Student): Promise<Student> {
    throw Error('Method not implemented.');
  }
}
