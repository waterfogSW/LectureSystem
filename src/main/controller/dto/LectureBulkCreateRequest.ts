import { LectureCreateRequest } from './LectureCreateRequest';
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';
import { Request } from 'express';
import { validateClass } from '../../common/util/ClassValidateUtil';
import { IllegalArgumentException } from '../../common/exception/IllegalArgumentException';

export class LectureBulkCreateRequest {

  @IsArray({ message: '잘못된 요청 형식입니다.' })
  @ArrayMinSize(1, { message: '최소 1개 이상의 강의를 요청해야 합니다.' })
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
    if (!items || !Array.isArray(items)) {
      throw new IllegalArgumentException('잘못된 요청 형식입니다.');
    }

    const requests: Array<LectureCreateRequest> = items.map((item: any) => {
      const { title, introduction, instructorId, category, price } = item;
      return LectureCreateRequest.of(title, introduction, instructorId, category, price);
    });

    return new LectureBulkCreateRequest(requests);
  }
}
