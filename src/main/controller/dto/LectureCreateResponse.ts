import { Lecture } from '../../domain/Lecture';

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
}
