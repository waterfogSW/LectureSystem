import { Student } from '../../../student/domain/Student';
import { Enrollment } from '../../../enrollment/domain/Enrollment';
import { Lecture } from '../../domain/Lecture';
import { LectureCategory } from '../../domain/LectureCategory';
import { LectureDetailResponseStudentItem } from './LectureDetailResponseStudentItem';

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
    enrollment: Array<Enrollment>,
    students: Array<Student | null>,
  ): LectureDetailResponse {
    const studentItems: Array<LectureDetailResponseStudentItem> =
      enrollment.map((
        enrollment: Enrollment,
        index: number,
      ) => LectureDetailResponseStudentItem.of(enrollment, students[index]));
    return new LectureDetailResponse(
      lecture.title,
      lecture.introduction,
      lecture.category,
      lecture.price,
      lecture.createdAt,
      lecture.updatedAt,
      studentCount,
      studentItems,
    );
  }

}

