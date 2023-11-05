import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PoolConnection } from 'mysql2/promise';
import { StudentService } from '../../../main/student/service/StudentService';
import { StudentRepository } from '../../../main/student/repository/StudentRepository';
import { MockFactory } from '../../util/MockFactory';
import { TestStudentFactory } from '../../util/TestStudentFactory';
import { Student } from '../../../main/student/domain/Student';
import { TestStudentDataFactory } from '../../util/TestStudentDataFactory';
import { NotFoundException } from '../../../main/common/exception/NotFoundException';
import { IllegalArgumentException } from '../../../main/common/exception/IllegalArgumentException';

describe('StudentService', () => {

  let connection: jest.Mocked<PoolConnection>;
  let studentRepository: jest.Mocked<StudentRepository>;
  let sut: StudentService;

  beforeEach(() => {
    studentRepository = MockFactory.create<StudentRepository>();
    sut = new StudentService(studentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('[Success] id값에 해당하는 학생을 조회한다.', async () => {
      // given
      const id: number = 1;
      const student = TestStudentFactory.createWithId(id);
      studentRepository.findById.mockResolvedValue(student);

      // when
      await sut.findById(id, connection);

      // then
      expect(studentRepository.findById).toBeCalledWith(id, connection);
    });

    it('[Failure] id값에 해당하는 학생이 없으면 NotFoundException을 던진다.', async () => {
      // given
      const id: number = 1;
      studentRepository.findById.mockResolvedValue(null);

      // when
      const actual = sut.findById(id, connection);

      // then
      await expect(actual).rejects.toThrowError('존재하지 않는 학생(id=1)입니다');
    });
  });

  describe('findByIdOrReturnUnknown', () => {
    it('[Success] id값에 해당하는 학생을 조회한다.', async () => {
      // given
      const id: number = 1;
      const student = TestStudentFactory.createWithId(id);
      studentRepository.findById.mockResolvedValue(student);

      // when
      const actual = await sut.findByIdOrReturnUnknown(id, connection);

      // then
      expect(actual).toEqual(student);
      expect(studentRepository.findById).toBeCalledWith(id, connection);
    });

    it('[Success] id값에 해당하는 학생이 없으면 unknown 학생을 반환한다.', async () => {
      // given
      const id: number = 1;
      studentRepository.findById.mockResolvedValue(null);

      // when
      const actual = await sut.findByIdOrReturnUnknown(id, connection);

      // then
      expect(actual.nickname).toEqual(Student.createUnknown().nickname);
      expect(studentRepository.findById).toBeCalledWith(id, connection);
    });
  });

  describe('create', () => {
    it('[Success] 학생을 생성한다.', async () => {
      // given
      const request = TestStudentDataFactory.createData();
      const student = TestStudentFactory.createWithId(1);
      studentRepository.existsByEmail.mockResolvedValue(false);
      studentRepository.save.mockResolvedValue(student);

      // when
      const actual = await sut.create(request, connection);

      // then
      expect(actual).toEqual(student);
      expect(studentRepository.existsByEmail).toBeCalledWith(request.email, connection);
      expect(studentRepository.save).toBeCalled();
    });

    it('[Failure] 이미 사용중인 이메일이면 예외를 던진다.', async () => {
      // given
      const request = TestStudentDataFactory.createData();
      studentRepository.existsByEmail.mockResolvedValue(true);

      // when
      const actual = sut.create(request, connection);

      // then
      await expect(actual).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('deleteById', () => {
    it('[Success] id값에 해당하는 학생을 삭제한다.', async () => {
      // given
      const id: number = 1;
      const student = TestStudentFactory.createWithId(id);
      studentRepository.findById.mockResolvedValue(student);

      // when
      await sut.deleteById(id, connection);

      // then
      expect(studentRepository.findById).toBeCalledWith(id, connection);
      expect(studentRepository.deleteById).toBeCalledWith(id, connection);
    });

    it('[Failure] id값에 해당하는 학생이 없으면 삭제를 요청하지 않는다.', async () => {
      // given
      const id: number = 1;
      jest.spyOn(sut, 'findById').mockRejectedValue(new NotFoundException(''));

      // when
      const actual = sut.deleteById(id, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
      expect(studentRepository.deleteById).not.toBeCalled();
    });
  });
});
