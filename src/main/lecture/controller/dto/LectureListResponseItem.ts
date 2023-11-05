import { LectureCategory } from '../../domain/LectureCategory';
import { parseEnum } from '../../../common/util/EnumUtil';

export class LectureListResponseItem {

  private readonly id: number;

  private readonly category: LectureCategory;

  private readonly title: string;

  private readonly instructor: string;

  private readonly price: number;

  private readonly studentCount: number;

  private readonly createdAt: Date;

  constructor(
    id: number,
    category: LectureCategory,
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
    id: number,
    category: string,
    title: string,
    instructor: string,
    price: number,
    studentCount: number,
    createdAt: string,
  ): LectureListResponseItem {
    return new LectureListResponseItem(
      id,
      parseEnum(category.toUpperCase(), LectureCategory),
      title,
      instructor,
      price,
      studentCount,
      new Date(createdAt),
    );
  }
}
