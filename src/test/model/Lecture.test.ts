import { describe, expect, it } from '@jest/globals';
import { Lecture } from '../../main/domain/Lecture';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { TestLectureFactory } from '../util/TestLectureFactory';


describe('Lecture', () => {

  describe('create', () => {

    it('[Success] 새로운 강의를 생성한다.', () => {
      // given
      const { title, introduction, instructorId, category, price } = TestLectureDataFactory.createData();

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
  });

  describe('update', () => {
    it('[Success] 강의 정보를 업데이트한다.(제목, 소개, 가격)', () => {
      // given
      const lecture: Lecture = TestLectureFactory.create();

      const testTitle: string = 'testTitle';
      const testIntroduction: string = 'testIntroduction';
      const testPrice: number = 1000;

      // when
      const updatedLecture: Lecture = lecture.update(testTitle, testIntroduction, testPrice);

      // then
      expect(updatedLecture.title).toBe(testTitle);
      expect(updatedLecture.introduction).toBe(testIntroduction);
      expect(updatedLecture.price).toBe(testPrice);
    });

    it('[Success] 강의 제목을 업데이트 한다.', () => {
      // given
      const lecture: Lecture = TestLectureFactory.create();
      const testTitle: string = 'testTitle';

      // when
      const updatedLecture: Lecture = lecture.update(testTitle);

      // then
      expect(updatedLecture.title).toBe(testTitle);
      expect(updatedLecture.introduction).toBe(lecture.introduction);
      expect(updatedLecture.price).toBe(lecture.price);
    });

    it('[Success] 강의 소개를 업데이트 한다.', () => {
      // given
      const lecture: Lecture = TestLectureFactory.create();
      const testIntroduction: string = 'testIntroduction';

      // when
      const updatedLecture: Lecture = lecture.update(undefined, testIntroduction);

      // then
      expect(updatedLecture.title).toBe(lecture.title);
      expect(updatedLecture.introduction).toBe(testIntroduction);
      expect(updatedLecture.price).toBe(lecture.price);
    });

    it('[Success] 강의 가격을 업데이트 한다.', () => {
      // given
      const lecture: Lecture = TestLectureFactory.create();
      const testPrice: number = 1000;

      // when
      const updatedLecture: Lecture = lecture.update(undefined, undefined, testPrice);

      // then
      expect(updatedLecture.title).toBe(lecture.title);
      expect(updatedLecture.introduction).toBe(lecture.introduction);
      expect(updatedLecture.price).toBe(testPrice);
    });

    it.each([2, 51])('[Failure] 변경할 강의 제목이 3자이상 50자 이하가 아닌경우 예외를 던진다.(길이 = %s)', (length: number) => {
      // given
      const lecture: Lecture = TestLectureFactory.create();
      const testTitle: string = 'a'.repeat(length);

      // when, then
      expect(() => lecture.update(testTitle)).toThrowError(IllegalArgumentException);
    });

    it.each([0, 5001])('[Failure] 변경할 강의 소개가 1자이상 5000자 이하가 아닌경우 예외를 던진다.(길이 = %s)', (length: number) => {
      // given
      const lecture: Lecture = TestLectureFactory.create();
      const testIntroduction: string = 'a'.repeat(length);

      // when, then
      expect(() => lecture.update(undefined, testIntroduction)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 변경할 강의 가격이 0 이상이 아닌경우 예외를 던진다.', () => {
      // given
      const lecture: Lecture = TestLectureFactory.create();

      const testPrice: number = -1;

      // when, then
      expect(() => lecture.update(undefined, undefined, testPrice)).toThrowError(IllegalArgumentException);
    });
  });
});
