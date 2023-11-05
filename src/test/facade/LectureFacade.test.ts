import 'reflect-metadata';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LectureService } from '../../main/service/LectureService';
import { StudentService } from '../../main/service/StudentService';
import { EnrollmentService } from '../../main/service/EnrollementSerivce';
import { MockFactory } from '../util/MockFactory';
import { initializeMockTransactionContext } from '../util/MockTransaction';
import { InstructorService } from '../../main/service/InstructorService';
import { LectureFacade } from '../../main/facade/LectureFacade';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { TestLectureFactory } from '../util/TestLectureFactory';
import { Lecture } from '../../main/domain/Lecture';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';
import { LectureListItem, LectureListResponse } from '../../main/controller/dto/LectureListResponse';
import { LectureListRequest } from '../../main/controller/dto/LectureListRequest';
import { LectureBulkCreateResponse } from '../../main/controller/dto/LectureBulkCreateResponse';
import { LectureBulkCreateRequest } from '../../main/controller/dto/LectureBulkCreateRequest';
import { HttpStatus } from '../../main/common/constant/HttpStatus';
import { errorStatusMappings } from '../../main/common/middleware/ExceptionHandler';
import { Enrollment } from '../../main/domain/Enrollment';
import { LectureDeleteRequest } from '../../main/controller/dto/LectureDeleteRequest';
import { LectureDetailRequest } from '../../main/controller/dto/LectureDetailRequest';
import { LectureDetailResponse } from '../../main/controller/dto/LectureDetailResponse';
import { Student } from '../../main/domain/Student';
import { TestStudentFactory } from '../util/TestStudentFactory';
import { LecturePublishRequest } from '../../main/controller/dto/LecturePublishRequest';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';

describe('LectureFacade', () => {

  let mockLectureService: jest.Mocked<LectureService>;
  let mockInstructorService: jest.Mocked<InstructorService>;
  let mockEnrollmentService: jest.Mocked<EnrollmentService>;
  let mockStudentService: jest.Mocked<StudentService>;
  let sut: LectureFacade;

  beforeEach(() => {
    initializeMockTransactionContext();
    mockLectureService = MockFactory.create<LectureService>();
    mockInstructorService = MockFactory.create<InstructorService>();
    mockEnrollmentService = MockFactory.create<EnrollmentService>();
    mockStudentService = MockFactory.create<StudentService>();
    sut = new LectureFacade(mockLectureService, mockInstructorService, mockEnrollmentService, mockStudentService);
  });


  describe('createLecture', () => {
    it('[Success] 강의 생성을 요청하고 응답을 반환한다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();

      const lecture: Lecture = TestLectureFactory.createWithId(1);
      mockLectureService.create.mockResolvedValueOnce(lecture);

      // when
      const response: LectureCreateResponse = await sut.createLecture(request);

      // then
      const id = Reflect.get(response, 'id');
      expect(id).toBe(lecture.id);
    });

    it('[Failure] 강사 아이디 검증에서 실패하면 강의생성을 요청할 수 없다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();

      mockInstructorService.validateInstructorExists.mockRejectedValueOnce(new Error());

      // when
      await expect(sut.createLecture(request)).rejects.toThrowError();
      expect(mockLectureService.create).not.toBeCalled();
    });
  });

  describe('listLecture', () => {
    it('[Success] 강의 목록을 요청하고 응답을 반환한다.', async () => {
      // given
      const request: LectureListRequest = new LectureListRequest(1, 1);

      const lectureItem: LectureListItem = LectureListItem.of(1, 'web', '강사명', '강사명', 1, 1, new Date().toString());
      mockLectureService.findAll.mockResolvedValueOnce([[lectureItem], 1]);

      // when
      const response = await sut.listLecture(request);

      // then
      expect(response).toBeInstanceOf(LectureListResponse);
    });
  });

  describe('createMultipleLectures', () => {
    it('[Success] 강의 생성을 요청하고 응답을 반환한다.', async () => {
      // given
      const mockCreateLecture = jest.spyOn(sut, 'createLecture');
      const request = new LectureBulkCreateRequest([
        TestLectureDataFactory.createData(),
        TestLectureDataFactory.createData(),
      ]);

      const expectedResponses = request.items.map((
          item,
          index,
        ) =>
          LectureCreateResponse.from(TestLectureFactory.createWithId(index + 1)),
      );

      mockCreateLecture.mockResolvedValueOnce(expectedResponses[0]);
      mockCreateLecture.mockResolvedValueOnce(expectedResponses[1]);

      // when
      const response = await sut.createMultipleLectures(request);
      const items = Reflect.get(response, 'items');

      // then
      expect(response).toBeInstanceOf(LectureBulkCreateResponse);
      expect(items[0].status).toEqual(HttpStatus.CREATED);
      expect(items[1].status).toEqual(HttpStatus.CREATED);
    });

    it.each(Object.values(errorStatusMappings))
    ('[Success] 강의 생성 요청중 실패한 요청이 있어도 응답을 반환한다.', async (error) => {
      // given
      const mockCreateLecture = jest.spyOn(sut, 'createLecture');
      const request = new LectureBulkCreateRequest([
        TestLectureDataFactory.createData(),
        TestLectureDataFactory.createData(),
      ]);

      const expectedResponses = request.items.map((
          item,
          index,
        ) =>
          LectureCreateResponse.from(TestLectureFactory.createWithId(index + 1)),
      );

      mockCreateLecture.mockResolvedValueOnce(expectedResponses[0]);
      mockCreateLecture.mockRejectedValueOnce(new error.type());

      // when
      const response = await sut.createMultipleLectures(request);
      const items = Reflect.get(response, 'items');

      // then
      expect(response).toBeInstanceOf(LectureBulkCreateResponse);
      expect(items[0].status).toEqual(HttpStatus.CREATED);
      expect(items[1].status).toEqual(error.status);
    });
  });

  describe('detailLecture', () => {
    it('[Success] 강의 상세정보를 요청하고 응답을 반환한다.', async () => {
      // given
      const request: LectureDetailRequest = new LectureDetailRequest(1);

      const lecture: Lecture = TestLectureFactory.createWithId(1);
      const enrollments: Array<Enrollment> = [
        new Enrollment(1, request.lectureId, 2),
        new Enrollment(2, request.lectureId, 3),
      ];
      const lectureStudentCount: number = enrollments.length;
      const students: Array<Student> = [
        TestStudentFactory.createWithId(enrollments[0].studentId),
        TestStudentFactory.createWithId(enrollments[1].studentId),
      ];

      mockLectureService.findById.mockResolvedValueOnce(lecture);
      mockLectureService.getLectureStudentCount.mockResolvedValueOnce(lectureStudentCount);
      mockEnrollmentService.findAllByLectureId.mockResolvedValueOnce(enrollments);
      mockStudentService.findByIdOrReturnUnknown.mockResolvedValueOnce(students[0]);
      mockStudentService.findByIdOrReturnUnknown.mockResolvedValueOnce(students[1]);

      // when
      const response = await sut.detailLecture(request);

      // then
      expect(response).toBeInstanceOf(LectureDetailResponse);
      expect(Reflect.get(response, 'title')).toBe(lecture.title);
      expect(Reflect.get(response, 'studentCount')).toBe(lectureStudentCount);
      expect(Reflect.get(response, 'students').length).toBe(students.length);
    });

    it('[Failure] 강의 정보 조회에 실패하면 예외를 전달한다.', async () => {
      // given
      const request: LectureDetailRequest = new LectureDetailRequest(1);

      mockLectureService.findById.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.detailLecture(request)).rejects.toThrowError();
    });

    it('[Failure] 강의의 등록학생수 조회가 예외를 던지면, 해당 예외를 전달한다.', async () => {
      // given
      const request: LectureDetailRequest = new LectureDetailRequest(1);

      mockLectureService.getLectureStudentCount.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.detailLecture(request)).rejects.toThrowError();
    });

    it('[Failure] 강의의 수강신청정보 조회가 예외를 던지면, 해당 예외를 전달한다.', async () => {
      // given
      const request: LectureDetailRequest = new LectureDetailRequest(1);

      mockEnrollmentService.findAllByLectureId.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.detailLecture(request)).rejects.toThrowError();
    });

    it('[Failure] 학생 정보조회가 예외를 던지면, 해당 예외를 전달한다.', async () => {
      // given
      const request: LectureDetailRequest = new LectureDetailRequest(1);

      const lecture: Lecture = TestLectureFactory.createWithId(1);
      const enrollments: Array<Enrollment> = [
        new Enrollment(1, request.lectureId, 2),
        new Enrollment(2, request.lectureId, 3),
      ];
      const lectureStudentCount: number = enrollments.length;
      const students: Array<Student> = [
        TestStudentFactory.createWithId(enrollments[0].studentId),
        TestStudentFactory.createWithId(enrollments[1].studentId),
      ];

      mockLectureService.findById.mockResolvedValueOnce(lecture);
      mockLectureService.getLectureStudentCount.mockResolvedValueOnce(lectureStudentCount);
      mockEnrollmentService.findAllByLectureId.mockResolvedValueOnce(enrollments);
      mockStudentService.findByIdOrReturnUnknown.mockResolvedValueOnce(students[0]);
      mockStudentService.findByIdOrReturnUnknown.mockRejectedValueOnce(new Error());

      // when, then
      await expect(sut.detailLecture(request)).rejects.toThrowError();
    });
  });

  describe('updateLecture', () => {
    it('[Success] 강의 정보를 수정을 요청한다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();

      // when
      await sut.updateLecture(request);

      // then
      expect(mockLectureService.update).toHaveBeenCalled();
    });
  });

  describe('deleteLecture', () => {
    it('[Success] 강의 정보를 삭제를 요청한다.', async () => {
      // given
      const request = new LectureDeleteRequest(1);

      // when
      await sut.deleteLecture(request);

      // then
      expect(mockEnrollmentService.validateNoEnrollmentExists).toHaveBeenCalled();
      expect(mockLectureService.delete).toHaveBeenCalled();
    });

    it('[Failure] 수강중인 학생이 존재하면 예외를 전달한다.', async () => {
      // given
      const request = new LectureDeleteRequest(1);

      mockEnrollmentService.validateNoEnrollmentExists.mockRejectedValueOnce(new IllegalArgumentException(""));

      // when, then
      await expect(sut.deleteLecture(request)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('publishLecture', () => {
    it('[Success] 강의 정보를 공개를 요청한다.', async () => {
      // given
      const request: LecturePublishRequest = new LecturePublishRequest(1);

      // when
      await sut.publishLecture(request);

      // then
      expect(mockLectureService.publish).toHaveBeenCalled();
    });
  });
});
