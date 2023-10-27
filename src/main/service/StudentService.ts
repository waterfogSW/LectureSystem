import { inject, injectable } from 'inversify';
import { Student } from '../domain/Student';
import { StudentRepository } from '../repository/StudentRepository';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/transactional';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';
import { NotFoundException } from '../common/exception/NotFoundException';
import { BindingTypes } from '../common/constant/BindingTypes';
import { StudentCreateRequest } from '../controller/dto/StudentCreateRequest';

@injectable()
export class StudentService {
  constructor(
    @inject(BindingTypes.StudentRepository) private readonly _studentRepository: StudentRepository,
  ) {}

  @transactional()
  public async createStudent(
    request: StudentCreateRequest,
    connection?: PoolConnection,
  ): Promise<Student> {
    const { nickname, email }: StudentCreateRequest = request;
    const student: Student = Student.create(nickname, email);
    const existsEmail: boolean = await this._studentRepository.existsByEmail(email, connection!);
    if (existsEmail) {
      throw new IllegalArgumentException('이미 사용중인 이메일 입니다');
    }

    return await this._studentRepository.save(student, connection!);
  }

  @transactional()
  public async deleteStudent(
    id: number,
    connection?: PoolConnection,
  ): Promise<void> {
    const student: Student | null = await this._studentRepository.findById(id, connection!);
    if (student === null) {
      throw new NotFoundException(`존재하지 않는 학생(id=${ id })입니다`);
    }

    await this._studentRepository.delete(id, connection!);
  }
}
