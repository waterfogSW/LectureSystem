import 'reflect-metadata';
import { StudentRepository } from '../../main/repository/StudentRepository';
import { StudentService } from '../../main/service/StudentService';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MockFactory } from '../util/MockFactory';
import { Student } from '../../main/model/Student';
import { InvalidInputError } from '../../main/common/error/InvalidInputError';


describe('수강생 서비스는', () => {

  let service: StudentService;
  let repository: jest.Mocked<StudentRepository>;

  beforeEach(() => {
    repository = MockFactory.create<StudentRepository>();
    service = new StudentService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('새로운 수강생을 가입시킨다.', async () => {
    // given
    const nickname: string = 'test';
    const email: string = 'test@example.com';

    repository.existsByEmail.mockResolvedValue(false);
    repository.save.mockResolvedValue(new Student(nickname, email));

    // when
    await service.createStudent(nickname, email);

    // then
    expect(repository.save).toBeCalledTimes(1);
  });

  it('이미 가입된 수강생의 이메일로 가입시키려고 하면 예외를 던진다.', async () => {
    // given
    const nickname: string = 'test';
    const email: string = 'test@example.com';

    repository.existsByEmail.mockResolvedValue(true);

    // when
    const promise: Promise<Student> = service.createStudent(nickname, email);

    // then
    await expect(promise).rejects.toThrowError(InvalidInputError);
  });
});

