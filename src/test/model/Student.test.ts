import { describe, expect, it } from '@jest/globals';
import { Student } from '../../main/domain/Student';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';


describe('Student', () => {

  describe('create', () => {
    it('[Success] 새로운 수강생을 생성한다', () => {
      // given
      const nickname: string = 'test';
      const email: string = 'test@example.com';

      // when
      const student: Student = Student.create(nickname, email);

      // then
      expect(student.nickname).toBe(nickname);
      expect(student.email).toBe(email);
    });

    it.each([2, 11])('[Failure] 닉네임이 3자 이상 10자 이하가 아니면 예외를 던진다 (닉네임 길이: %i)', (length: number) => {
      // given
      const nickname: string = 'a'.repeat(length);
      const email: string = 'test@example.com';

      // when, then
      expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 닉네임이 공백이면 예외를 던진다', () => {
      // given
      const nickname: string = '';
      const email: string = 'test@example.com';

      // when, then
      expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 이메일이 공백이면 예외를 던진다', () => {
      // given
      const nickname: string = 'test';
      const email: string = '';

      // when, then
      expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 이메일이 형식에 맞지 않으면 예외를 던진다', () => {
      // given
      const nickname: string = 'test';
      const email: string = 'test';

      // when, then
      expect(() => Student.create(nickname, email)).toThrowError(IllegalArgumentException);
    });
  });
});
