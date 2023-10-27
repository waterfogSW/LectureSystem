import 'reflect-metadata';
import 'reflect-metadata';
import { LectureService } from '../../main/service/LectureService';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { InstructorRepository } from '../../main/repository/InstructorRepository';
import { MockFactory } from '../util/MockFactory';
import { Lecture } from '../../main/model/Lecture';
import { Instructor } from '../../main/model/Instructor';
import { NotFoundException } from '../../main/common/exception/NotFoundException';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

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
    it('강의를 성공적으로 생성한다', async () => {
      // given
      const title = 'New Lecture';
      const introduction = 'Introduction to new lecture';
      const instructorId = 1;
      const category = 'WEB';
      const price = 10000;

      const mockInstructor: Instructor = new Instructor(instructorId, 'Instructor Name');
      instructorRepository.findById.mockResolvedValue(mockInstructor);

      const mockLecture: Lecture = new Lecture(1, title, introduction, instructorId, category, price);
      lectureRepository.save.mockResolvedValue(mockLecture);

      // when
      const result: Lecture = await lectureService.createLecture(title, introduction, instructorId, category, price);

      // then
      expect(instructorRepository.findById).toBeCalledTimes(1);
    });

    it('존재하지 않는 강사 ID로 강의를 생성하려고 하면 NotFoundException을 던진다', async () => {
      // given
      const title = 'New Lecture';
      const introduction = 'Introduction to new lecture';
      const instructorId = 999; // 존재하지 않는 강사 ID
      const category = 'WEB';
      const price = 10000;

      instructorRepository.findById.mockResolvedValue(null);

      // when
      const promise: Promise<Lecture> = lectureService.createLecture(title, introduction, instructorId, category, price);

      // then
      await expect(promise).rejects.toThrow(new NotFoundException(`존재하지 않는 강사 ID(${ instructorId }) 입니다`));
    });
  });
});
