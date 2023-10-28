import { LectureCategoryNames } from '../../domain/LectureType';
import { Lecture } from '../../domain/Lecture';
import { Instructor } from '../../domain/Instructor';

export class LectureListResponse {

  private readonly lectures: Array<LectureListResponseItem>;
  private readonly page: number;
  private readonly totalPages: number;


  constructor(
    items: Array<LectureListResponseItem>,
    page: number,
    totalPages: number,
  ) {
    this.lectures = items;
    this.page = page;
    this.totalPages = totalPages;
  }

  public static of(
    items: Array<LectureListResponseItem>,
    page: number,
    totalPages: number,
  ): LectureListResponse {
    return new LectureListResponse(
      items,
      page,
      totalPages,
    );
  }
}

class LectureListResponseItem {

  private readonly id: number;
  private readonly category: LectureCategoryNames;
  private readonly title: string;
  private readonly instructor: string;
  private readonly price: number;
  private readonly studentCount: number;
  private readonly createdAt: Date;

  constructor(
    id: number,
    category: LectureCategoryNames,
    title: string,
    instructor: string,
    price: number,
    studentCount: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.category = category;
    this.title = title;
    this.instructor = instructor;
    this.price = price;
    this.studentCount = studentCount;
    this.createdAt = createdAt;
  }

  public static of(
    lecture: Lecture,
    instructor: Instructor,
    studentCount: number,
  ): LectureListResponseItem {
    return new LectureListResponseItem(
      lecture.id!,
      lecture.category,
      lecture.title,
      instructor.name,
      lecture.price,
      studentCount,
      lecture.createdAt,
    );
  }
}
