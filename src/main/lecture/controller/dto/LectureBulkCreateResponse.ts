import { LectureBulkCreateResponseItem } from './LectureBulkCreateResponseItem';

export class LectureBulkCreateResponse {

  private readonly items: Array<LectureBulkCreateResponseItem>;

  constructor(items: Array<LectureBulkCreateResponseItem>) {
    this.items = items;
  }

  public static from(items: Array<LectureBulkCreateResponseItem>): LectureBulkCreateResponse {
    return new LectureBulkCreateResponse(items);
  }
}

