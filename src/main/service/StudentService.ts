import { inject, injectable } from 'inversify';
import { Student } from '../model/Student';
import { StudentRepository } from '../repository/StudentRepository';
import TYPES from '../common/constant/bindingTypes';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/transactional';
import { InvalidInputError } from '../common/error/InvalidInputError';

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
    const existsEmail: boolean = await this._studentRepository.existsByEmail(email, connection!);
    if (existsEmail) {
      throw new InvalidInputError('Email already exists');
    }

    return await this._studentRepository.save(student, connection!);
  }
}
