import { LectureCreateRequest } from './LectureCreateRequest';
import { ArrayMaxSize, IsArray } from 'class-validator';
import { Request } from 'express';
import { validateClass } from '../../common/util/ClassValidateUtil';

export class LectureBulkCreateRequest {

  @IsArray({ message: '잘못된 요청 형식입니다.' })
  @ArrayMaxSize(10, { message: '최대 10개까지 요청 가능합니다.' })
  private readonly _items: Array<LectureCreateRequest>;

  constructor(items: Array<LectureCreateRequest>) {
    this._items = items;
    validateClass(this);
  }

  public get items(): Array<LectureCreateRequest> {
    return this._items;
  }

  public static from(request: Request): LectureBulkCreateRequest {
    const { items } = request.body;
    const requests: Array<LectureCreateRequest> = items.map((item: any) => {
      const { title, introduction, instructorId, category, price } = item;
      return new LectureCreateRequest(title, introduction, instructorId, category, price);
    });

    return new LectureBulkCreateRequest(requests);
  }
}
