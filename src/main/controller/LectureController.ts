import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { LectureService } from '../service/LectureService';
import { LectureCreateResponse } from './dto/LectureCreateResponse';
import { type Request, type Response } from 'express';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { LectureCreateRequest } from './dto/LectureCreateRequest';
import { LectureListRequest } from './dto/LectureListRequest';
import { LectureListResponse } from './dto/LectureListResponse';
import { LectureBulkCreateResponse } from './dto/LectureBulkCreateResponse';
import { LectureBulkCreateRequest } from './dto/LectureBulkCreateRequest';
import { LectureDetailRequest } from './dto/LectureDetailRequest';
import { LectureDetailResponse } from './dto/LectureDetailResponse';

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

  public async createLectureBulk(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureBulkCreateRequest: LectureBulkCreateRequest = LectureBulkCreateRequest.from(request);
    const lectureBulkCreateResponse: LectureBulkCreateResponse = await this._lectureService.createLectureBulk(lectureBulkCreateRequest);
    response
      .status(HTTP_STATUS.CREATED)
      .json(lectureBulkCreateResponse);
  }

  public async detailLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureDetailRequest: LectureDetailRequest = LectureDetailRequest.from(request);
    const lectureDetailResponse: LectureDetailResponse = await this._lectureService.detailLecture(lectureDetailRequest);
    response
      .status(HTTP_STATUS.OK)
      .json(lectureDetailResponse);
  }
}
