import { Id } from '../../../common/entity/BaseEntity';
import { HttpStatus } from '../../../common/constant/HttpStatus';

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
    title: string,
  ): LectureBulkCreateResponseItem {
    return new LectureBulkCreateResponseItem(id, title, HttpStatus.CREATED, '');
  }

  public static createWithFail(
    title: string,
    status: HttpStatus,
    message: string,
  ): LectureBulkCreateResponseItem {
    return new LectureBulkCreateResponseItem(undefined, title, status, message);
  }
}
