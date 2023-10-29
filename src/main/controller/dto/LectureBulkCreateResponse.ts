import { Id } from '../../common/entity/BaseEntity';
import { HTTP_STATUS, HttpStatus } from '../../common/constant/HttpStatus';
import { NotFoundException } from '../../common/exception/NotFoundException';

export class LectureBulkCreateResponse {

  private readonly items: Array<LectureBulkCreateResponseItem>;

  constructor(items: Array<LectureBulkCreateResponseItem>) {
    this.items = items;
  }

  public static from(items: Array<LectureBulkCreateResponseItem>): LectureBulkCreateResponse {
    return new LectureBulkCreateResponse(items);
  }
}

export class LectureBulkCreateResponseItem {

  private readonly id: Id;
  private readonly title: string;
  private readonly status: HttpStatus;
  private readonly message: string;

  constructor(
    id: Id,
    title: string,
    status: HttpStatus,
    message: string,
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.message = message;
  }

  public static createWithSuccess(
    id: Id,
    title: string
  ): LectureBulkCreateResponseItem {
    return new LectureBulkCreateResponseItem(id, title, HTTP_STATUS.CREATED, '');
  }

  public static createWithFail(
    title: string,
    error: Error
  ): LectureBulkCreateResponseItem {
    const status: HttpStatus = error instanceof NotFoundException ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return new LectureBulkCreateResponseItem(undefined, title, status, error.message);
  }
}
