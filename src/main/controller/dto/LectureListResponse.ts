import { LectureCategory } from '../../domain/LectureEnums';
import { parseEnum } from '../../common/util/EnumUtil';

export class LectureListResponse {

  private readonly items: Array<LectureListItem>;
  private readonly page: number;
  private readonly pageSize: number;
  private readonly total: number;

  constructor(
    items: Array<LectureListItem>,
    page: number,
    pageSize: number,
    total: number,
  ) {
    this.items = items;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
  }

  public static of(
    items: Array<LectureListItem>,
    page: number,
    pageSize: number,
    total: number,
  ): LectureListResponse {
    return new LectureListResponse(
      items,
      page,
      pageSize,
      total,
    );
  }
}

export class LectureListItem {

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
  ): LectureListItem {
    return new LectureListItem(
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
