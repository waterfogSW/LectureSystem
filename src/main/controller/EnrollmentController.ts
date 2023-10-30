import { injectable } from 'inversify';
import { EnrollmentService } from '../service/EnrollmentService';

@injectable()
export class EnrollmentController {

  private readonly _enrollmentService: EnrollmentService;

  constructor(enrollmentService: EnrollmentService) {
    this._enrollmentService = enrollmentService;
  }
}
