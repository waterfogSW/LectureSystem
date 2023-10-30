import { injectable } from 'inversify';
import { EnrollmentRepository } from '../repository/EnrollmentRepository';


@injectable()
export class EnrollmentService {

  private readonly _enrollmentRepository: EnrollmentRepository;


  constructor(enrollmentRepository: EnrollmentRepository) {
    this._enrollmentRepository = enrollmentRepository;
  }
}
