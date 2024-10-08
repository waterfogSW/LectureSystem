import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PoolConnection } from 'mysql2/promise';
import { BindingTypes } from '../../common/constant/BindingTypes';
import { StudentRepository } from '../repository/StudentRepository';
import { Student } from '../domain/Student';
import { NotFoundException } from '../../common/exception/NotFoundException';
import { StudentCreateRequest } from '../controller/dto/StudentCreateRequest';
import { IllegalArgumentException } from '../../common/exception/IllegalArgumentException';

@injectable()
export class StudentService {
  constructor(
    @inject(BindingTypes.StudentRepository)
    private readonly _studentRepository: StudentRepository,
  ) {}

  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Student> {
    const student: Student | null = await this._studentRepository.findById(id, connection);
    if (student === null) {
      throw new NotFoundException(`존재하지 않는 학생(id=${ id })입니다`);
    }
    return student;
  }

  public async findByIdOrReturnUnknown(
    id: number,
    connection: PoolConnection,
  ): Promise<Student> {
    const student: Student | null = await this._studentRepository.findById(id, connection);
    if (student === null) {
      return Student.createUnknown();
    }
    return student;
  }

  public async create(
    request: StudentCreateRequest,
    connection: PoolConnection,
  ): Promise<Student> {
    const { nickname, email }: StudentCreateRequest = request;
    const student: Student = Student.create(nickname, email);
    const existsEmail: boolean = await this._studentRepository.existsByEmail(email, connection!);
    if (existsEmail) {
      throw new IllegalArgumentException(`이미 사용중인 이메일(email=${ email }) 입니다`);
    }

    return this._studentRepository.save(student, connection!);
  }

  public async deleteById(
    id: number,
    connection: PoolConnection,
  ): Promise<void> {
    const student: Student = await this.findById(id, connection);
    await Promise.all([
      this._studentRepository.deleteById(id, connection),
      this._studentRepository.createDeletedStudent(student, connection)
    ]);
  }

}
