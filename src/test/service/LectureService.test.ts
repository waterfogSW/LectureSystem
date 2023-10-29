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

describe('LectureService', () => {
  let lectureService: LectureService;
  let lectureRepository: jest.Mocked<LectureRepository>;
  let lectureStudentCountRepository: jest.Mocked<LectureStudentCountRepository>;
  let instructorRepository: jest.Mocked<InstructorRepository>;

  beforeEach(() => {
    lectureRepository = MockFactory.create<LectureRepository>();
    lectureStudentCountRepository = MockFactory.create<LectureStudentCountRepository>();
    instructorRepository = MockFactory.create<InstructorRepository>();
    lectureService = new LectureService(lectureRepository, lectureStudentCountRepository, instructorRepository);
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
      instructorRepository.findById.mockResolvedValue(mockInstructor);

      const mockLecture: Lecture = TestLectureFactory.createWithId(1);
      lectureRepository.save.mockResolvedValue(mockLecture);

      // when
      const result: LectureCreateResponse = await lectureService.createLecture(request);

      // then
      const resultId = Reflect.get(result, 'id');
      expect(resultId).toBe(mockLecture.id);
    });

    it('존재하지 않는 강사 ID로 강의를 생성하려고 하면 NotFoundException 을 던진다', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: LectureCreateRequest = new LectureCreateRequest(data.title, data.introduction, data.instructorId, data.category, data.price);
      instructorRepository.findById.mockResolvedValue(null); // 강사 ID가 존재하지 않는다고 가정

      // when
      const promise: Promise<LectureCreateResponse> = lectureService.createLecture(request);

      // then
      await expect(promise).rejects.toThrowError(NotFoundException);
    });
  });
});
