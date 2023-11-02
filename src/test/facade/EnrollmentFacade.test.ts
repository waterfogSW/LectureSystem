import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LectureService } from '../../main/service/LectureService';
import { StudentService } from '../../main/service/StudentService';
import { EnrollmentService } from '../../main/service/EnrollementSerivce';
import { EnrollmentFacade } from '../../main/facade/EnrollmentFacade';
import { MockFactory } from '../util/MockFactory';
import { EnrollmentCreateRequest } from '../../main/controller/dto/EnrollmentCreateRequest';
import { TestEnrollmentFactory } from '../util/TestEnrollmentFactory';
import { initializeMockTransactionContext } from '../util/MockTransaction';

describe('EnrollmentFacade', () => {

  let mockEnrollmentService: jest.Mocked<EnrollmentService>;
  let mockStudentService: jest.Mocked<StudentService>;
  let mockLectureService: jest.Mocked<LectureService>;
  let sut: EnrollmentFacade;

  beforeEach(() => {
    initializeMockTransactionContext();
    mockEnrollmentService = MockFactory.create<EnrollmentService>();
    mockStudentService = MockFactory.create<StudentService>();
    mockLectureService = MockFactory.create<LectureService>();
    sut = new EnrollmentFacade(mockEnrollmentService, mockStudentService, mockLectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEnrollments', () => {
    it('[Success] 수강신청을 요청한다', async () => {
      // given
      const request: EnrollmentCreateRequest = new EnrollmentCreateRequest([1], 1);

      const enrollment = TestEnrollmentFactory.createWithId(1);
      mockEnrollmentService.create.mockResolvedValueOnce(enrollment);

      // when
      await sut.createEnrollments(request);

      // then
      expect(mockLectureService.validateNoDuplicateLectureIds).toBeCalledWith(request.lectureIds);
    });

    it('[Failure] 중복 강의 id 검사에서 실패하면 수강신청을 요청할 수 없다.', async () => {
      // given
      const request: EnrollmentCreateRequest = new EnrollmentCreateRequest([1, 1], 1);

      mockLectureService.validateNoDuplicateLectureIds.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.createEnrollments(request)).rejects.toThrowError();
      expect(mockEnrollmentService.create).not.toBeCalled();
    });

    it('[Failure] 학생 id 검사에서 실패하면 수강신청을 요청할 수 없다.', async () => {
      // given
      const request: EnrollmentCreateRequest = new EnrollmentCreateRequest([1], 1);

      mockStudentService.validateStudentExists.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.createEnrollments(request)).rejects.toThrowError();
      expect(mockEnrollmentService.create).not.toBeCalled();
    });

    it('[Failure] 강의가 개설되지 않았으면 수강신청을 요청할 수 없다.', async () => {
      // given
      const request: EnrollmentCreateRequest = new EnrollmentCreateRequest([1], 1);

      mockLectureService.validateAllLecturesPublished.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.createEnrollments(request)).rejects.toThrowError();
      expect(mockEnrollmentService.create).not.toBeCalled();
    });

    it('[Failure] 이미 수강신청한 강의는 수강신청을 요청할 수 없다.', async () => {
      // given
      const request: EnrollmentCreateRequest = new EnrollmentCreateRequest([1], 1);

      mockEnrollmentService.validateNoEnrollmentAlreadyExists.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.createEnrollments(request)).rejects.toThrowError();
      expect(mockEnrollmentService.create).not.toBeCalled();
    });
  });

});
