import { inject, injectable } from 'inversify';
import { PoolConnection } from 'mysql2/promise';
import { EnrollmentCreateRequest } from '../controller/dto/EnrollmentCreateRequest';
import { transactional } from '../../common/decorator/Transactional';
import { Enrollment } from '../domain/Enrollment';
import { EnrollmentCreateResponse } from '../controller/dto/EnrollmentCreateResponse';
import { BindingTypes } from '../../common/constant/BindingTypes';
import { EnrollmentService } from '../service/EnrollementSerivce';
import { StudentService } from '../../student/service/StudentService';
import { LectureService } from '../../lecture/service/LectureService';


@injectable()
export class EnrollmentFacade {

  constructor(
    @inject(BindingTypes.EnrollmentService)
    private readonly _enrollmentService: EnrollmentService,
    @inject(BindingTypes.StudentService)
    private readonly _studentService: StudentService,
    @inject(BindingTypes.LectureService)
    private readonly _lectureService: LectureService,
  ) {}

  @transactional()
  public async createEnrollments(
    request: EnrollmentCreateRequest,
    connection?: PoolConnection,
  ): Promise<EnrollmentCreateResponse> {
    const { lectureIds, studentId }: EnrollmentCreateRequest = request;

    await Promise.all([
      this._lectureService.validateNoDuplicateLectureIds(lectureIds),
      this._studentService.findById(studentId, connection!),
      this._lectureService.validateAllLecturesPublished(lectureIds, connection!),
      this._enrollmentService.validateNoEnrollmentAlreadyExists(lectureIds, studentId, connection!),
    ]);

    const createdEnrollments: Array<Enrollment> = await Promise.all(
      lectureIds.map((lectureId: number) => this._enrollmentService.create(lectureId, studentId, connection!)),
    );
    return EnrollmentCreateResponse.from(createdEnrollments);
  }
}
