import { describe, expect, it } from '@jest/globals';
import { Student } from '../../main/model/Student';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';


describe('수강생', () => {

  it('새로운 수강생을 생성한다.', () => {
    // given
    const nickname: string = 'test';
    const email: string = 'test@example.com';

    // when
    const student: Student = Student.create(nickname, email);

    // then
    expect(student.nickname).toBe(nickname);
    expect(student.email).toBe(email);
  });

  it.each([2, 31])('닉네임은 1자 이상 30자 이하만 가능하다. (닉네임 길이: %i)', (length: number) => {
    // given
    const nickname: string = 'a'.repeat(length);
    const email: string = 'test@example.com';

    // when, then
    expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
  });

  it('닉네임은 공백일 수 없다.', () => {
    // given
    const nickname: string = '';
    const email: string = 'test@example.com';

    // when, then
    expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
  });

  it('이메일은 공백일 수 없다.', () => {
    // given
    const nickname: string = 'test';
    const email: string = '';

    // when, then
    expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
  });

  it('이메일은 이메일 형식이어야 한다.', () => {
    // given
    const nickname: string = 'test';
    const email: string = 'test';

    // when, then
    expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
  });
});
