import 'reflect-metadata';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Lecture } from '../../main/domain/Lecture';
import { TestLectureFactory } from '../util/TestLectureFactory';

describe('LectureRepository', () => {
  let lectureRepository: LectureRepository;
  let mockConnection: any;

  beforeEach(() => {
    lectureRepository = new LectureRepository();
    mockConnection = { execute: jest.fn() };
  });

  describe('save', () => {
    it('강의를 저장하고 저장된 강의를 반환한다', async () => {
      // given
      const insertedId = 123;
      const lecture = TestLectureFactory.create();
      mockConnection.execute.mockResolvedValue([{ insertId: insertedId }, []]);

      // when
      const savedLecture: Lecture = await lectureRepository.save(lecture, mockConnection);

      // then
      expect(savedLecture).toBeInstanceOf(Lecture);
      expect(savedLecture.id).toBe(insertedId);
    });
  });
});
