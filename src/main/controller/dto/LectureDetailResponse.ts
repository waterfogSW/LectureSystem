
import { Student } from '../../domain/Student';
import { Enrollment } from '../../domain/Enrollment';
import { Lecture } from '../../domain/Lecture';
import { LectureCategory } from '../../domain/LectureType';

export class LectureDetailResponse {

  private readonly title: string;
  private readonly introduction: string;
  private readonly category: LectureCategory;
  private readonly price: number;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  private readonly studentCount: number;
  private readonly students: Array<LectureDetailResponseStudentItem>;

  constructor(
    title: string,
    introduction: string,
    category: LectureCategory,
    price: number,
    createdAt: Date,
    updatedAt: Date,
    studentCount: number,
    students: Array<LectureDetailResponseStudentItem>,
  ) {
    this.title = title;
    this.introduction = introduction;
    this.category = category;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.studentCount = studentCount;
    this.students = students;
  }

  public static of(
    lecture: Lecture,
    studentCount: number,
    students: Array<LectureDetailResponseStudentItem>,
  ): LectureDetailResponse {
    return new LectureDetailResponse(
      lecture.title,
      lecture.introduction,
      lecture.category,
      lecture.price,
      lecture.createdAt,
      lecture.updatedAt,
      studentCount,
      students,
    );
  }

}

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
