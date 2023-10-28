import 'reflect-metadata';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Lecture } from '../../main/domain/Lecture';

describe('LectureRepository', () => {
  let lectureRepository: LectureRepository;
  let mockConnection: any;
  let lectureData: any;
  let lecture: Lecture;

  beforeEach(() => {
    lectureRepository = new LectureRepository();
    mockConnection = { execute: jest.fn() };
    lectureData = {
      title: 'Test Lecture',
      introduction: 'This is a test lecture',
      instructorId: 1,
      category: 'WEB',
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    lecture = new Lecture(
      undefined,
      lectureData.title,
      lectureData.introduction,
      lectureData.instructorId,
      lectureData.category,
      lectureData.price,
      lectureData.createdAt,
      lectureData.updatedAt,
    );
  });

  describe('save', () => {
    it('강의를 저장하고 저장된 강의를 반환한다', async () => {
      // given
      const insertedId = 123;
      mockConnection.execute.mockResolvedValue([{ insertId: insertedId }, []]);

      // when
      const savedLecture = await lectureRepository.save(lecture, mockConnection);

      // then
      expect(savedLecture).toEqual(expect.objectContaining({
        id: insertedId,
        title: lectureData.title,
        introduction: lectureData.introduction,
        instructorId: lectureData.instructorId,
        category: lectureData.category,
        price: lectureData.price,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }));
    });
  });
});
