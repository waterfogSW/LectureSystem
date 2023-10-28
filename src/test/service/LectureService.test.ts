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

describe('LectureService', () => {
  let lectureService: LectureService;
  let lectureRepository: jest.Mocked<LectureRepository>;
  let instructorRepository: jest.Mocked<InstructorRepository>;

  beforeEach(() => {
    lectureRepository = MockFactory.create<LectureRepository>();
    instructorRepository = MockFactory.create<InstructorRepository>();
    lectureService = new LectureService(lectureRepository, instructorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecture', () => {

    it('강의를 생성하고, 생성된 강의를 반환한다.', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: LectureCreateRequest = new LectureCreateRequest(data.title, data.introduction, data.instructorId, data.category, data.price);

      const mockInstructor: Instructor = new Instructor(data.instructorId, 'Instructor Name');
      instructorRepository.findById.mockResolvedValue(mockInstructor);

      const mockLecture: Lecture = TestLectureFactory.createWithId(1);
      lectureRepository.save.mockResolvedValue(mockLecture);

      // when
      const result: Lecture = await lectureService.createLecture(request);

      // then
      expect(result.id).toBeDefined();
      expect(result).toBeInstanceOf(Lecture);
    });

    it('존재하지 않는 강사 ID로 강의를 생성하려고 하면 NotFoundException 을 던진다', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: LectureCreateRequest = new LectureCreateRequest(data.title, data.introduction, data.instructorId, data.category, data.price);
      instructorRepository.findById.mockResolvedValue(null); // 강사 ID가 존재하지 않는다고 가정

      // when
      const promise: Promise<Lecture> = lectureService.createLecture(request);

      // then
      await expect(promise).rejects.toThrowError(NotFoundException);
    });
  });
});
