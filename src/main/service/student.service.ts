import { inject, injectable } from 'inversify';
import { Student } from '../model/student.model';
import { StudentRepository } from '../repository/student.repository';
import TYPES from '../common/type/types';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/transactional.decorator';

@injectable()
export class StudentService {

  constructor(
    @inject(TYPES.StudentRepository) private readonly _studentRepository: StudentRepository,
  ) {}

  @transactional()
  public async createStudent(
    nickname: string,
    email: string,
    connection?: PoolConnection,
  ): Promise<Student> {
    const student: Student = new Student(nickname, email);
    return await this._studentRepository.save(student, connection!);
  }

}
