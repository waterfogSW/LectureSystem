import { describe, expect, it } from '@jest/globals';
import { Lecture } from '../../main/domain/Lecture';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { LectureCategory } from '../../main/domain/LectureEnums';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';


describe('Lecture', () => {

  describe('create', () => {

    it('[Success] 새로운 강의를 생성한다.', () => {
      // given
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData()

      // when
      const lecture: Lecture = Lecture.create(title, introduction, instructorId, category, price);

      // then
      expect(lecture.title).toBe(title);
      expect(lecture.introduction).toBe(introduction);
      expect(lecture.instructorId).toBe(instructorId);
      expect(lecture.category).toBe(category);
      expect(lecture.price).toBe(price);
    });

    it.each([2, 51])('[Failure] 강의 제목이 3자 이상 50자 이하가 아니면 예외를 던진다 (강의 제목 길이: %i)', (length: number) => {
      // given
      const testTitle: string = 'a'.repeat(length);
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData({ title: testTitle });

      // when, then
      expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
    });


    it.each([0, 5001])('[Failure] 강의 소개가 1자 이상 5000자 이하가 아니면 예외를 던진다.(강의 소개 길이: %i)', (length: number) => {
      // given
      const testIntroduction: string = 'a'.repeat(length);
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData({ introduction: testIntroduction });

      // when, then
      expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 강사의 아이디가 1이상이 아니면 예외를 던진다.', () => {
      // given
      const testInstructorId: number = 0;
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData({ instructorId: testInstructorId });

      // when, then
      expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 강의 가격이 0 이상이 아니면 예외를 던진다.', () => {
      // given
      const testPrice: number = -1;
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData({ price: testPrice });

      // when, then
      expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
    });
  })

});
