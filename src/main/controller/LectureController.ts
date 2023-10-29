import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { LectureService } from '../service/LectureService';
import { LectureCreateResponse } from './dto/LectureCreateResponse';
import { type Request, type Response } from 'express';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { LectureCreateRequest } from './dto/LectureCreateRequest';
import { LectureListRequest } from './dto/LectureListRequest';
import { LectureListResponse } from './dto/LectureListResponse';

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
    const lectureCreateResponse: LectureCreateResponse = await this._lectureService.createLecture(lectureCreateRequest);
    response
      .status(HTTP_STATUS.CREATED)
      .json(lectureCreateResponse);
  }

  public async listLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureListRequest: LectureListRequest = LectureListRequest.from(request);
    const lectureListResponse: LectureListResponse = await this._lectureService.listLecture(lectureListRequest);
    response
      .status(HTTP_STATUS.OK)
      .json(lectureListResponse);
  }
}
