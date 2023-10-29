import { Lecture } from '../../domain/Lecture';
import { Id } from '../../common/entity/BaseEntity';

export class LectureCreateResponse {

  private readonly _id: number;
  private readonly _title: string;

  constructor(
    id: number,
    title: string,
  ) {
    this._id = id;
    this._title = title;
  }

  public get id(): Id {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public static from(lecture: Lecture): LectureCreateResponse {
    return new LectureCreateResponse(lecture.id!, lecture.title);
  }
}
