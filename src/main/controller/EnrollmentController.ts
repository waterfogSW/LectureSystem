import { inject, injectable } from 'inversify';
import { EnrollmentService } from '../service/EnrollmentService';
import { Request, Response } from 'express';
import { EnrollmentCreateRequest } from './dto/EnrollmentCreateRequest';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { BindingTypes } from '../common/constant/BindingTypes';
import { EnrollmentCreateResponse } from './dto/EnrollmentCreateResponse';

@injectable()
export class EnrollmentController {

  private readonly _enrollmentService: EnrollmentService;

  constructor(
    @inject(BindingTypes.EnrollmentService)
    enrollmentService: EnrollmentService
  ) {
    this._enrollmentService = enrollmentService;
  }

  public async createEnrollment(
    request: Request,
    response: Response,
  ): Promise<void> {
    const enrollmentCreateRequest: EnrollmentCreateRequest = EnrollmentCreateRequest.from(request);
    const enrollmentCreateResponse: EnrollmentCreateResponse = await this._enrollmentService.createEnrollment(enrollmentCreateRequest);

    response
      .status(HTTP_STATUS.OK)
      .json(enrollmentCreateResponse);
  }
}
