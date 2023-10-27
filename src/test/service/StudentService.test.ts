import 'reflect-metadata';
import { StudentRepository } from '../../main/repository/StudentRepository';
import { StudentService } from '../../main/service/StudentService';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MockFactory } from '../util/MockFactory';
import { Student } from '../../main/domain/Student';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { NotFoundException } from '../../main/common/exception/NotFoundException';
import { StudentCreateRequest } from '../../main/controller/dto/StudentCreateRequest';


describe('StudentService', () => {

  let service: StudentService;
  let repository: jest.Mocked<StudentRepository>;

  beforeEach(() => {
    repository = MockFactory.create<StudentRepository>();
    service = new StudentService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {

    it('수강생을 생성하고, 생성된 수강생을 반환한다.', async () => {
      // given
      const nickname: string = 'test';
      const email: string = 'test@example.com';
      const studentCreateRequest: StudentCreateRequest = new StudentCreateRequest(nickname, email);

      repository.existsByEmail.mockResolvedValue(false);
      repository.save.mockResolvedValue(new Student(1, nickname, email));

      // when
      const savedStudent = await service.createStudent(studentCreateRequest);

      // then
      expect(savedStudent.id).toBeDefined();
    });

    it('이미 가입된 수강생의 이메일로 가입시키려고 하면 예외를 던진다.', async () => {
      // given
      const nickname: string = 'test';
      const email: string = 'test@example.com';
      const studentCreateRequest: StudentCreateRequest = new StudentCreateRequest(nickname, email);

      repository.existsByEmail.mockResolvedValue(true);

      // when
      const promise: Promise<Student> = service.createStudent(studentCreateRequest);

      // then
      await expect(promise).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('deleteStudent', () => {
    it('수강생을 삭제한다.', async () => {
      // given
      const id: number = 1;
      const student: Student = new Student(id, 'test', 'test@example.com');

      repository.findById.mockResolvedValue(student);

      // when
      await service.deleteStudent(id);

      // then
      expect(repository.delete).toBeCalledTimes(1);
    });

    it('존재하지 않는 수강생을 삭제하려고 하면 예외를 던진다.', async () => {
      // given
      const id: number = 1;
      repository.findById.mockResolvedValue(null);

      // when
      const promise: Promise<void> = service.deleteStudent(id);

      // then
      await expect(promise).rejects.toThrowError(NotFoundException);
    });
  });
});

