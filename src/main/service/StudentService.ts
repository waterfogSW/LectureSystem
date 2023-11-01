import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { StudentRepository } from '../repository/StudentRepository';
import { PoolConnection } from 'mysql2/promise';
import { Student } from '../domain/Student';
import { NotFoundException } from '../common/exception/NotFoundException';
import { StudentCreateRequest } from '../controller/dto/StudentCreateRequest';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';
import { StudentCreateResponse } from '../controller/dto/StudentCreateResponse';

@injectable()
export class StudentService {
  constructor(
    @inject(BindingTypes.StudentRepository)
    private readonly _studentRepository: StudentRepository,
  ) {}

  public async findByIdOrReturnDeletedStudent(
    id: number,
    connection: PoolConnection,
  ): Promise<Student> {
    const student: Student | null = await this._studentRepository.findById(id, connection);
    if (student === null) {
      return Student.createDeletedStudent();
    }
    return student;
  }

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

  public async create(
    request: StudentCreateRequest,
    connection: PoolConnection,
  ): Promise<StudentCreateResponse> {
    const { nickname, email }: StudentCreateRequest = request;
    const student: Student = Student.create(nickname, email);
    const existsEmail: boolean = await this._studentRepository.existsByEmail(email, connection!);
    if (existsEmail) {
      throw new IllegalArgumentException(`이미 사용중인 이메일(email=${ email }) 입니다`);
    }

    const createdStudent: Student = await this._studentRepository.save(student, connection!);
    return StudentCreateResponse.from(createdStudent);
  }

  public async delete(
    id: number,
    connection: PoolConnection,
  ): Promise<void> {
    await this.findById(id, connection);
    await this._studentRepository.deleteById(id, connection);
  }

}
