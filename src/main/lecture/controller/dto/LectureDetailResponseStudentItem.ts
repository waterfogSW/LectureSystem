import { Enrollment } from '../../../enrollment/domain/Enrollment';
import { Student } from '../../../student/domain/Student';

export class LectureDetailResponseStudentItem {

  private readonly nickname: string;

  private readonly enrolledAt: Date;

  constructor(
    nickname: string,
    enrolledAt: Date,
  ) {
    this.nickname = nickname;
    this.enrolledAt = enrolledAt;
  }

  public static of(
    enrollment: Enrollment,
    student: Student | null,
  ): LectureDetailResponseStudentItem {
    return new LectureDetailResponseStudentItem(
      student?.nickname ?? '탈퇴한 회원',
      enrollment.createdAt,
    );
  }

}
