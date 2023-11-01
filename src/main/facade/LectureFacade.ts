import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { Lecture } from '../domain/Lecture';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/Transactional';
import { LectureCreateRequest } from '../controller/dto/LectureCreateRequest';
import { LectureCreateResponse } from '../controller/dto/LectureCreateResponse';
import { LectureListRequest } from '../controller/dto/LectureListRequest';
import { LectureListItem, LectureListResponse } from '../controller/dto/LectureListResponse';
import { LectureBulkCreateRequest } from '../controller/dto/LectureBulkCreateRequest';
import { LectureBulkCreateResponse, LectureBulkCreateResponseItem } from '../controller/dto/LectureBulkCreateResponse';
import { LectureDetailRequest } from '../controller/dto/LectureDetailRequest';
import { LectureDetailResponse } from '../controller/dto/LectureDetailResponse';
import { Enrollment } from '../domain/Enrollment';
import { Student } from '../domain/Student';
import { LectureUpdateRequest } from '../controller/dto/LectureUpdateRequest';
import { LectureDeleteRequest } from '../controller/dto/LectureDeleteRequest';
import { LecturePublishRequest } from '../controller/dto/LecturePublishRequest';
import { EnrollmentService } from '../service/EnrollementSerivce';
import { LectureService } from '../service/LectureService';
import { InstructorService } from '../service/InstructorService';
import { StudentService } from '../service/StudentService';
import { HttpStatus } from '../common/constant/HttpStatus';
import { errorStatusMappings } from '../common/middleware/ExceptionHandler';


@injectable()
export class LectureFacade {

  constructor(
    @inject(BindingTypes.LectureService)
    private readonly _lectureService: LectureService,
    @inject(BindingTypes.InstructorService)
    private readonly _instructorService: InstructorService,
    @inject(BindingTypes.EnrollmentService)
    private readonly _enrollmentService: EnrollmentService,
    @inject(BindingTypes.StudentService)
    private readonly _studentService: StudentService,
  ) {}

  @transactional()
  public async createLecture(
    request: LectureCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureCreateResponse> {
    const { instructorId }: LectureCreateRequest = request;
    await this._instructorService.validateInstructorExists(instructorId, connection!);
    const createdLecture: Lecture = await this._lectureService.create(request, connection!);
    return LectureCreateResponse.from(createdLecture);
  }

  @transactional()
  public async listLecture(
    request: LectureListRequest,
    connection?: PoolConnection,
  ): Promise<LectureListResponse> {
    const { page, pageSize }: LectureListRequest = request;
    const [lectureListItems, lectureCount]: [Array<LectureListItem>, number] = await this._lectureService.findAll(request, connection!);
    return LectureListResponse.of(lectureListItems, page, pageSize, lectureCount);
  }

  @transactional()
  public async createMultipleLectures(
    request: LectureBulkCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureBulkCreateResponse> {
    const responseItems: Array<LectureBulkCreateResponseItem> = await Promise.all(
      request.items.map((item: LectureCreateRequest) => this.createItemWithHandlingError(item, connection)),
    );
    return LectureBulkCreateResponse.from(responseItems);
  }

  @transactional()
  public async detailLecture(
    { lectureId }: LectureDetailRequest,
    connection?: PoolConnection,
  ): Promise<LectureDetailResponse> {
    const [lecture, studentCount, enrollments]: [Lecture, number, Array<Enrollment>] = await Promise.all([
      this._lectureService.findById(lectureId, connection!),
      this._lectureService.getLectureStudentCount(lectureId, connection!),
      this._enrollmentService.findAllByLectureId(lectureId, connection!),
    ]);

    const students: Array<Student> = await Promise.all(
      enrollments.map((enrollment: Enrollment) => this._studentService.findByIdOrReturn(enrollment.studentId, Student.createDeletedStudent, connection!)),
    );

    return LectureDetailResponse.of(lecture, studentCount, enrollments, students);
  }

  @transactional()
  public async updateLecture(
    request: LectureUpdateRequest,
    connection?: PoolConnection,
  ): Promise<void> {
    await this._lectureService.update(request, connection!);
  }

  @transactional()
  public async deleteLecture(
    request: LectureDeleteRequest,
    connection?: PoolConnection,
  ): Promise<void> {
    await this._lectureService.delete(request, connection!);
  }

  @transactional()
  public async publishLecture(
    request: LecturePublishRequest,
    connection?: PoolConnection,
  ): Promise<void> {
    await this._lectureService.publish(request, connection!);
  }

  private async createItemWithHandlingError(
    request: LectureCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureBulkCreateResponseItem> {
    try {
      const response: LectureCreateResponse = await this.createLecture(request, connection);
      return LectureBulkCreateResponseItem.createWithSuccess(response.id, response.title);
    } catch (error) {
      if (error instanceof Error) {
        const status: HttpStatus = errorStatusMappings.find((mapping): boolean => error instanceof mapping.type)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        return LectureBulkCreateResponseItem.createWithFail(request.title, status, error.message);
      }
      return LectureBulkCreateResponseItem.createWithFail(request.title, HttpStatus.INTERNAL_SERVER_ERROR, '알 수 없는 에러');
    }
  }
}
