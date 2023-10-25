import { inject, injectable } from 'inversify';
import { Student } from '../model/Student';
import { StudentRepository } from '../repository/StudentRepository';
import TYPES from '../common/constant/bindingTypes';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/transactional';
import { InvalidInputError } from '../common/error/InvalidInputError';
import { NotFoundError } from '../common/error/NotFoundError';

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
      throw new InvalidInputError('이미 사용중인 이메일 입니다');
    }

    return await this._studentRepository.save(student, connection!);
  }

  @transactional()
  public async deleteStudent(
    id: number,
    connection?: PoolConnection,
  ):Promise<void> {
    const student: Student | null = await this._studentRepository.findById(id, connection!);
    if (student === null) {
      throw new NotFoundError(`존재하지 않는 학생(id=${id})입니다`);
    }

    await this._studentRepository.delete(id, connection!);
  }
}
