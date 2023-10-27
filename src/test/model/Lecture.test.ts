import { describe, expect, it } from '@jest/globals';
import { Lecture } from '../../main/model/Lecture';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';


describe('Lecture', () => {

  it('새로운 강의를 생성한다.', () => {
    // given
    const title: string = 'test';
    const introduction: string = 'test';
    const instructorId: number = 1;
    const category: string = 'WEB';
    const price: number = 1000;

    // when
    const lecture: Lecture = Lecture.create(title, introduction, instructorId, category, price);

    // then
    expect(lecture.title).toBe(title);
    expect(lecture.introduction).toBe(introduction);
    expect(lecture.instructorId).toBe(instructorId);
    expect(lecture.category).toBe(category);
    expect(lecture.price).toBe(price);
  });

  it('카테고리 명이 소문자여도 대문자로 저장된다.', () => {
    // given
    const title: string = 'test';
    const introduction: string = 'test';
    const instructorId: number = 1;
    const category: string = 'web';
    const price: number = 1000;

    // when
    const lecture: Lecture = Lecture.create(title, introduction, instructorId, category, price);

    // then
    expect(lecture.category).toBe(category.toUpperCase());
  });

  it.each([2, 21])('강의 제목은 3자 이상 20자 이하만 가능하다. (강의 제목 길이: %i)', (length: number) => {
    // given
    const title: string = 'a'.repeat(length);
    const introduction: string = 'test';
    const instructorId: number = 1;
    const category: string = 'WEB';
    const price: number = 1000;

    // when, then
    expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
  });


  it.each([0, 5001])('강의 소개는 1자 이상 5000자 이하만 가능하다. (강의 소개 길이: %i)', (length: number) => {
    // given
    const title: string = 'test';
    const introduction: string = 'a'.repeat(length);
    const instructorId: number = 1;
    const category: string = 'WEB';
    const price: number = 1000;

    // when, then
    expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
  });

  it('강사의 아이디는 1 이상이어야 한다.', () => {
    // given
    const title: string = 'test';
    const introduction: string = 'test';
    const instructorId: number = 0;
    const category: string = 'WEB';
    const price: number = 1000;

    // when, then
    expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
  });

  it('강의 가격은 0 이상이어야 한다.', () => {
    // given
    const title: string = 'test';
    const introduction: string = 'test';
    const instructorId: number = 1;
    const category: string = 'WEB';
    const price: number = -1;

    // when, then
    expect(() => Lecture.create(title, introduction, instructorId, category, price)).toThrowError(IllegalArgumentException);
  });
  
});
