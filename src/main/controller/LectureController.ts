import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { LectureFacade } from '../facade/LectureFacade';
import { LectureCreateResponse } from './dto/LectureCreateResponse';
import { type Request, type Response } from 'express';
import { HttpStatus } from '../common/constant/HttpStatus';
import { LectureCreateRequest } from './dto/LectureCreateRequest';
import { LectureListRequest } from './dto/LectureListRequest';
import { LectureListResponse } from './dto/LectureListResponse';
import { LectureBulkCreateResponse } from './dto/LectureBulkCreateResponse';
import { LectureBulkCreateRequest } from './dto/LectureBulkCreateRequest';
import { LectureDetailRequest } from './dto/LectureDetailRequest';
import { LectureDetailResponse } from './dto/LectureDetailResponse';
import { LectureUpdateRequest } from './dto/LectureUpdateRequest';
import { LectureDeleteRequest } from './dto/LectureDeleteRequest';
import { LecturePublishRequest } from './dto/LecturePublishRequest';

@injectable()
export class LectureController {

  constructor(
    @inject(BindingTypes.LectureFacade)
    private readonly _lectureFacade: LectureFacade,
  ) {}

  public async createLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureCreateRequest: LectureCreateRequest = LectureCreateRequest.from(request);
    const lectureCreateResponse: LectureCreateResponse = await this._lectureFacade.createLecture(lectureCreateRequest);
    response
      .status(HttpStatus.CREATED)
      .json(lectureCreateResponse);
  }

  public async listLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureListRequest: LectureListRequest = LectureListRequest.from(request);
    const lectureListResponse: LectureListResponse = await this._lectureFacade.listLecture(lectureListRequest);
    response
      .status(HttpStatus.OK)
      .json(lectureListResponse);
  }

  public async createMultipleLectures(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureBulkCreateRequest: LectureBulkCreateRequest = LectureBulkCreateRequest.from(request);
    const lectureBulkCreateResponse: LectureBulkCreateResponse = await this._lectureFacade.createMultipleLectures(lectureBulkCreateRequest);
    response
      .status(HttpStatus.CREATED)
      .json(lectureBulkCreateResponse);
  }

  public async detailLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureDetailRequest: LectureDetailRequest = LectureDetailRequest.from(request);
    const lectureDetailResponse: LectureDetailResponse = await this._lectureFacade.detailLecture(lectureDetailRequest);
    response
      .status(HttpStatus.OK)
      .json(lectureDetailResponse);
  }

  public async updateLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureUpdateRequest: LectureUpdateRequest = LectureUpdateRequest.from(request);
    await this._lectureFacade.updateLecture(lectureUpdateRequest);
    response
      .status(HttpStatus.OK)
      .send();
  }

  public async deleteLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lectureDeleteRequest: LectureDeleteRequest = LectureDeleteRequest.from(request);
    await this._lectureFacade.deleteLecture(lectureDeleteRequest);
    response
      .status(HttpStatus.OK)
      .send();
  }

  public async publishLecture(
    request: Request,
    response: Response,
  ): Promise<void> {
    const lecturePublishRequest: LecturePublishRequest = LecturePublishRequest.from(request);
    await this._lectureFacade.publishLecture(lecturePublishRequest);
    response
      .status(HttpStatus.OK)
      .send();
  }


}
