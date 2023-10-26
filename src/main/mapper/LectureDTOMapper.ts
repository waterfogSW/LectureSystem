import { injectable } from 'inversify';
import { LectureCreateResponse } from '../controller/dto/LectureCreateResponse';
import { Lecture } from '../model/Lecture';

@injectable()
export class LectureDTOMapper {

  public toLectureCreateResponse(lecture: Lecture): LectureCreateResponse {
    return {
      id: lecture.id!,
      title: lecture.title,
    };
  }
}
