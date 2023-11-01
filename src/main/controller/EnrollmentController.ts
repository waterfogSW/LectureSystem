import { inject, injectable } from 'inversify';
import { EnrollmentFacade } from '../facade/EnrollmentFacade';
import { Request, Response } from 'express';
import { EnrollmentCreateRequest } from './dto/EnrollmentCreateRequest';
import { HttpStatus } from '../common/constant/HttpStatus';
import { BindingTypes } from '../common/constant/BindingTypes';
import { EnrollmentCreateResponse } from './dto/EnrollmentCreateResponse';

@injectable()
export class EnrollmentController {

  constructor(
    @inject(BindingTypes.EnrollmentFacade)
    private readonly _enrollmentFacade: EnrollmentFacade,
  ) {}

  public async createEnrollment(
    request: Request,
    response: Response,
  ): Promise<void> {
    const enrollmentCreateRequest: EnrollmentCreateRequest = EnrollmentCreateRequest.from(request);
    const enrollmentCreateResponse: EnrollmentCreateResponse = await this._enrollmentFacade.createEnrollments(enrollmentCreateRequest);

    response
      .status(HttpStatus.OK)
      .json(enrollmentCreateResponse);
  }
}
