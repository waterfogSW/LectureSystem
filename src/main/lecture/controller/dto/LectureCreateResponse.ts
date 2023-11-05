import { Lecture } from '../../domain/Lecture';
import { Id } from '../../../common/entity/BaseEntity';

export class LectureCreateResponse {

  private readonly id: number;

  private readonly title: string;

  constructor(
    id: number,
    title: string,
  ) {
    this.id = id;
    this.title = title;
  }

  public static from(lecture: Lecture): LectureCreateResponse {
    return new LectureCreateResponse(lecture.id!, lecture.title);
  }

  public getId(): Id {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }
}
