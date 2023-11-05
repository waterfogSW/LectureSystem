import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PoolConnection } from 'mysql2/promise';
import { EnrollmentRepository } from '../../../main/enrollment/repository/EnrollmentRepository';
import { LectureStudentCountRepository } from '../../../main/lecture/repository/LectureStudentCountRepository';
import { EnrollmentService } from '../../../main/enrollment/service/EnrollementSerivce';
import { MockFactory } from '../../util/MockFactory';
import { Enrollment } from '../../../main/enrollment/domain/Enrollment';
import { NotFoundException } from '../../../main/common/exception/NotFoundException';


describe('EnrollmentService', () => {

  let connection: jest.Mocked<PoolConnection>;
  let mockEnrollmentRepository: jest.Mocked<EnrollmentRepository>;
  let mockLectureStudentCountRepository: jest.Mocked<LectureStudentCountRepository>;
  let sut: EnrollmentService;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    mockEnrollmentRepository = MockFactory.create<EnrollmentRepository>();
    mockLectureStudentCountRepository = MockFactory.create<LectureStudentCountRepository>();
    sut = new EnrollmentService(mockEnrollmentRepository, mockLectureStudentCountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllByLectureId', () => {

    it('[Success] LectureId를 가진 모든 Enrollment 조회를 요청한다.', async () => {
      // given
      const lectureId: number = 1;

      const expected: Array<Enrollment> = [
        new Enrollment(1, 1, 1),
        new Enrollment(2, 1, 2),
      ];

      mockEnrollmentRepository.findAllByLectureId.mockResolvedValue(expected);

      // when
      const actual: Array<Enrollment> = await sut.findAllByLectureId(lectureId, connection);

      // then
      expect(actual).toEqual(expected);
    });
  });

  describe('findByLectureIdAndStudentId', () => {

    it('[Success] LectureId와 StudentId를 가진 Enrollment 조회를 요청한다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;

      const expected: Enrollment = new Enrollment(1, 1, 1);

      mockEnrollmentRepository.findByLectureIdAndStudentId.mockResolvedValue(expected);

      // when
      const actual: Enrollment = await sut.findByLectureIdAndStudentId(lectureId, studentId, connection);

      // then
      expect(actual).toEqual(expected);
    });

    it('[Failure] Enrollment 가 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;

      mockEnrollmentRepository.findByLectureIdAndStudentId.mockResolvedValue(null);

      // when
      const actual: Promise<Enrollment> = sut.findByLectureIdAndStudentId(lectureId, studentId, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });
  });

  describe('validateNoEnrollmentAlreadyExists', () => {

    it('[Success] 이미 수강중인 강의가 없으면 예외를 던지지 않는다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const studentId: number = 1;

      // when
      jest.spyOn(sut, 'findByLectureIdAndStudentId').mockRejectedValue(new NotFoundException(''));
      const actual: Promise<void> = sut.validateNoEnrollmentAlreadyExists(lectureIds, studentId, connection);

      // then
      await expect(actual).resolves.not.toThrowError();
    });

    it('[Failure] 이미 수강중인 강의가 있으면 예외를 던진다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const studentId: number = 1;

      const expected: Array<Enrollment> = [
        new Enrollment(1, 1, 1),
        new Enrollment(2, 1, 2),
      ];

      jest.spyOn(sut, 'findByLectureIdAndStudentId').mockResolvedValue(expected[0]);

      // when
      const actual: Promise<void> = sut.validateNoEnrollmentAlreadyExists(lectureIds, studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('create', () => {

    it('[Success] Enrollment 를 생성하고 Lecture 의 학생수를 증가시킨다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;

      const expected: Enrollment = new Enrollment(1, 1, 1);

      mockEnrollmentRepository.save.mockResolvedValue(expected);
      mockLectureStudentCountRepository.increment.mockResolvedValue();

      // when
      const actual: Enrollment = await sut.create(lectureId, studentId, connection);

      // then
      expect(actual).toEqual(expected);
      expect(mockEnrollmentRepository.save).toBeCalled();
      expect(mockLectureStudentCountRepository.increment).toBeCalled();
    });

    it('[Failure] 저장에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;

      mockEnrollmentRepository.save.mockRejectedValue(new Error());

      // when
      const actual: Promise<Enrollment> = sut.create(lectureId, studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });

    it('[Failure] 학생수 증가에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;

      const expected: Enrollment = new Enrollment(1, 1, 1);

      mockEnrollmentRepository.save.mockResolvedValue(expected);
      mockLectureStudentCountRepository.increment.mockRejectedValue(new Error());

      // when
      const actual: Promise<Enrollment> = sut.create(lectureId, studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('deleteAllByStudentId', () => {
    it('[Success] 해당 학생의 모든 수강 정보를 삭제하고 학생이 등록한 강의의 카운트를 감소시킨다.', async () => {
      // given
      const studentId: number = 1;
      const enrollments: Array<Enrollment> = [
        new Enrollment(1, 1, 1),
        new Enrollment(2, 1, 2),
      ];

      mockEnrollmentRepository.findAllByStudentId.mockResolvedValue(enrollments);

      // when
      await sut.deleteAllByStudentId(studentId, connection);

      // then
      expect(mockLectureStudentCountRepository.decrement).toBeCalledTimes(enrollments.length);
      expect(mockEnrollmentRepository.deleteById).toBeCalledTimes(enrollments.length);
    });

    it('[Failure] Enrollment 조회에 실패하면 예외를 던진다.', async () => {
      // given
      const studentId: number = 1;

      mockEnrollmentRepository.findAllByStudentId.mockRejectedValue(new Error());

      // when
      const actual: Promise<void> = sut.deleteAllByStudentId(studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });

    it('[Failure] Enrollment 삭제에 실패하면 예외를 던진다.', async () => {
      // given
      const studentId: number = 1;
      const enrollments: Array<Enrollment> = [
        new Enrollment(1, 1, 1),
        new Enrollment(2, 1, 2),
      ];

      mockEnrollmentRepository.findAllByStudentId.mockResolvedValue(enrollments);
      mockEnrollmentRepository.deleteById.mockRejectedValue(new Error());

      // when
      const actual: Promise<void> = sut.deleteAllByStudentId(studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });

    it('[Failure] Lecture 학생수 감소에 실패하면 예외를 던진다.', async () => {
      // given
      const studentId: number = 1;
      const enrollments: Array<Enrollment> = [
        new Enrollment(1, 1, 1),
        new Enrollment(2, 1, 2),
      ];

      mockEnrollmentRepository.findAllByStudentId.mockResolvedValue(enrollments);
      mockLectureStudentCountRepository.decrement.mockRejectedValue(new Error());

      // when
      const actual: Promise<void> = sut.deleteAllByStudentId(studentId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });
});
