import 'reflect-metadata';
import { LectureService } from '../../main/service/LectureService';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { InstructorRepository } from '../../main/repository/InstructorRepository';
import { MockFactory } from '../util/MockFactory';
import { Lecture } from '../../main/domain/Lecture';
import { Instructor } from '../../main/domain/Instructor';
import { NotFoundException } from '../../main/common/exception/NotFoundException';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LectureCreateRequest } from '../../main/controller/dto/LectureCreateRequest';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { TestLectureFactory } from '../util/TestLectureFactory';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';
import { LectureStudentCountRepository } from '../../main/repository/LectureStudentCountRepository';
import { EnrollmentRepository } from '../../main/repository/EnrollmentRepository';
import { StudentRepository } from '../../main/repository/StudentRepository';

describe('LectureService', () => {

  let mockLectureRepository: jest.Mocked<LectureRepository>;
  let mockLectureStudentCountRepository: jest.Mocked<LectureStudentCountRepository>;
  let mockInstructorRepository: jest.Mocked<InstructorRepository>;
  let mockEnrollmentRepository: jest.Mocked<EnrollmentRepository>;
  let mockStudentRepository: jest.Mocked<StudentRepository>;

  let sut: LectureService;

  beforeEach(() => {
    mockLectureRepository = MockFactory.create<LectureRepository>();
    mockLectureStudentCountRepository = MockFactory.create<LectureStudentCountRepository>();
    mockInstructorRepository = MockFactory.create<InstructorRepository>();
    mockEnrollmentRepository = MockFactory.create<EnrollmentRepository>();
    mockStudentRepository = MockFactory.create<StudentRepository>();

    sut = new LectureService(
      mockLectureRepository,
      mockLectureStudentCountRepository,
      mockInstructorRepository,
      mockEnrollmentRepository,
      mockStudentRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecture', () => {

    it('강의를 생성하고, 생성된 강의 정보를 반환한다.', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: LectureCreateRequest = new LectureCreateRequest(data.title, data.introduction, data.instructorId, data.category, data.price);

      const mockInstructor: Instructor = new Instructor(data.instructorId, 'Instructor Name');
      mockInstructorRepository.findById.mockResolvedValue(mockInstructor);

      const mockLecture: Lecture = TestLectureFactory.createWithId(1);
      mockLectureRepository.save.mockResolvedValue(mockLecture);

      // when
      const result: LectureCreateResponse = await sut.createLecture(request);

      // then
      const resultId = Reflect.get(result, 'id');
      expect(resultId).toBe(mockLecture.id);
    });

    it('존재하지 않는 강사 ID로 강의를 생성하려고 하면 NotFoundException 을 던진다', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: LectureCreateRequest = new LectureCreateRequest(data.title, data.introduction, data.instructorId, data.category, data.price);
      mockInstructorRepository.findById.mockResolvedValue(null); // 강사 ID가 존재하지 않는다고 가정

      // when
      const promise: Promise<LectureCreateResponse> = sut.createLecture(request);

      // then
      await expect(promise).rejects.toThrowError(NotFoundException);
    });
  });
});
