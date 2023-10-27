import { injectable } from 'inversify';
import { LectureCreateResponse } from '../dto/LectureCreateResponse';
import { Lecture } from '../../domain/Lecture';
import { Request } from 'express';
import { LectureCreateRequest } from '../dto/LectureCreateRequest';

@injectable()
export class LectureDTOMapper {

  public toLectureCreateResponse(lecture: Lecture): LectureCreateResponse {
    return {
      id: lecture.id!,
      title: lecture.title,
    };
  }

  public toLectureCreateRequest(request: Request): LectureCreateRequest {
    const { title, introduction, instructorId, category, price } = request.body;
    return new LectureCreateRequest(title, introduction, instructorId, category, price);
  }
}
