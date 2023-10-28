import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { LectureService } from '../service/LectureService';
import { Lecture } from '../domain/Lecture';
import { LectureCreateResponse } from './dto/LectureCreateResponse';
import { type Request, type Response } from 'express';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { LectureCreateRequest } from './dto/LectureCreateRequest';

@injectable()
export class LectureController {

  constructor(
    @inject(BindingTypes.LectureService) private readonly _lectureService: LectureService,
  ) {}

  public async createLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureCreateRequest: LectureCreateRequest = LectureCreateRequest.from(request);
    const lecture: Lecture = await this._lectureService.createLecture(lectureCreateRequest);
    const body: LectureCreateResponse = LectureCreateResponse.from(lecture);
    response
      .status(HTTP_STATUS.CREATED)
      .json(body);
  }

}
