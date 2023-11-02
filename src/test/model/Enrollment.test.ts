import { describe, expect, it } from '@jest/globals';
import { Enrollment } from '../../main/domain/Enrollment';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';

describe('Enrollment', () => {

  describe('create', () => {

    it('[Success] 새로운 수강 신청을 생성한다.', () => {
      // given
      const { lectureId, studentId } = { lectureId: 1, studentId: 1 }

      // when
      const enrollment: Enrollment = Enrollment.create(lectureId, studentId);

      // then
      expect(enrollment.lectureId).toBe(lectureId);
      expect(enrollment.studentId).toBe(studentId);
    });

    it('[Failure] 강의 아이디가 1이상이 아니면 예외를 던진다.', () => {
      // given
      const testLectureId: number = 0;
      const { lectureId, studentId } = { lectureId: testLectureId, studentId: 1 }

      // when, then
      expect(() => Enrollment.create(lectureId, studentId)).toThrowError(IllegalArgumentException);
    });

    it('[Failure] 수강 신청자의 아이디가 1이상이 아니면 예외를 던진다.', () => {
      // given
      const testStudentId: number = 0;
      const { lectureId, studentId } = { lectureId: 1, studentId: testStudentId }

      // when, then
      expect(() => Enrollment.create(lectureId, studentId)).toThrowError(IllegalArgumentException);
    });
  })
});
