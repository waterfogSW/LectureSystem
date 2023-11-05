import { LectureListResponseItem } from './LectureListResponseItem';

export class LectureListResponse {

  private readonly items: Array<LectureListResponseItem>;

  private readonly page: number;

  private readonly pageSize: number;

  private readonly total: number;

  constructor(
    items: Array<LectureListResponseItem>,
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
    items: Array<LectureListResponseItem>,
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

