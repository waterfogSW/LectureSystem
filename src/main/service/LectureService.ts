import { inject, injectable } from 'inversify';
import { LectureRepository } from '../repository/LectureRepository';
import { BindingTypes } from '../common/constant/BindingTypes';
import { Lecture } from '../domain/Lecture';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/Transactional';
import { InstructorRepository } from '../repository/InstructorRepository';
import { Instructor } from '../domain/Instructor';
import { NotFoundException } from '../common/exception/NotFoundException';
import { LectureCreateRequest } from '../controller/dto/LectureCreateRequest';
import { LectureCreateResponse } from '../controller/dto/LectureCreateResponse';
import { LectureListRequest } from '../controller/dto/LectureListRequest';
import { LectureListItem, LectureListResponse } from '../controller/dto/LectureListResponse';
import { LectureStudentCountRepository } from '../repository/LectureStudentCountRepository';
import { LectureBulkCreateRequest } from '../controller/dto/LectureBulkCreateRequest';
import { LectureBulkCreateResponse, LectureBulkCreateResponseItem } from '../controller/dto/LectureBulkCreateResponse';
import { LectureDetailRequest } from '../controller/dto/LectureDetailRequest';
import { LectureDetailResponse, LectureDetailResponseStudentItem } from '../controller/dto/LectureDetailResponse';
import { StudentRepository } from '../repository/StudentRepository';
import { Enrollment } from '../domain/Enrollment';
import { EnrollmentRepository } from '../repository/EnrollmentRepository';
import { Student } from '../domain/Student';
import { LectureUpdateRequest } from '../controller/dto/LectureUpdateRequest';


@injectable()
export class LectureService {

  constructor(
    @inject(BindingTypes.LectureRepository)
    private readonly _lectureRepository: LectureRepository,
    @inject(BindingTypes.LectureStudentCountRepository)
    private readonly _lectureStudentCountRepository: LectureStudentCountRepository,
    @inject(BindingTypes.InstructorRepository)
    private readonly _instructorRepository: InstructorRepository,
    @inject(BindingTypes.EnrollmentRepository)
    private readonly _enrollmentRepository: EnrollmentRepository,
    @inject(BindingTypes.StudentRepository)
    private readonly _studentRepository: StudentRepository,
  ) {}

  @transactional()
  public async createLecture(
    request: LectureCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureCreateResponse> {
    const { title, introduction, instructorId, category, price }: LectureCreateRequest = request;
    const instructor: Instructor | null = await this._instructorRepository.findById(instructorId, connection!);
    if (instructor === null) {
      throw new NotFoundException(`존재하지 않는 강사 ID(${ instructorId }) 입니다`);
    }

    const lecture: Lecture = Lecture.create(title, introduction, instructor.id!, category, price);
    const createdLecture: Lecture = await this._lectureRepository.save(lecture, connection!);
    await this._lectureStudentCountRepository.create(createdLecture.id!, connection!);

    return LectureCreateResponse.from(createdLecture);
  }

  @transactional()
  public async listLecture(
    lectureListRequest: LectureListRequest,
    connection?: PoolConnection,
  ): Promise<LectureListResponse> {
    const { page, pageSize, order, category, searchType, searchKeyword }: LectureListRequest = lectureListRequest;
    const [lectureListItems, lectureCount]: [Array<LectureListItem>, number] = await Promise.all([
      this._lectureRepository.findByPage(
        connection!,
        page,
        pageSize,
        order,
        category,
        searchType,
        searchKeyword,
      ),
      this._lectureRepository.count(
        connection!,
        category,
        searchType,
        searchKeyword,
      ),
    ]) as [Array<LectureListItem>, number];

    return LectureListResponse.of(lectureListItems, page, pageSize, lectureCount);
  }

  @transactional()
  public async createLectureBulk(
    lectureBulkCreateRequest: LectureBulkCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureBulkCreateResponse> {
    const requests: Array<LectureCreateRequest> = lectureBulkCreateRequest.items;
    const responseItems: Array<LectureBulkCreateResponseItem> = await Promise.all(
      requests.map((request: LectureCreateRequest) => this._processSingleLectureCreateRequest(request, connection!)),
    );
    return LectureBulkCreateResponse.from(responseItems);
  }

  @transactional()
  public async detailLecture(
    { lectureId }: LectureDetailRequest,
    connection?: PoolConnection,
  ): Promise<LectureDetailResponse> {
    const lecture: Lecture | null = await this._lectureRepository.findById(lectureId, connection!);
    if (!lecture) {
      throw new NotFoundException(`존재하지 않는 강의 ID(${lectureId}) 입니다`);
    }

    const [studentCount, enrollments]: [number, Array<Enrollment>] = await Promise.all([
      this._lectureStudentCountRepository.getStudentCount(lectureId, connection!),
      this._enrollmentRepository.findAllByLectureId(lectureId, connection!),
    ]);

    const studentItems: Array<Student | null> = await Promise.all(
      enrollments.map((enrollment: Enrollment) =>
        this._studentRepository.findById(enrollment.studentId, connection!)
      )
    );

    const lectureStudents: Array<LectureDetailResponseStudentItem> = enrollments.map((enrollment, index) =>
      LectureDetailResponseStudentItem.of(enrollment, studentItems[index])
    );

    return LectureDetailResponse.of(lecture, studentCount, lectureStudents);
  }

  @transactional()
  public async updateLecture(
    lectureUpdateRequest: LectureUpdateRequest,
    connection?: PoolConnection,
  ): Promise<void> {
    const { lectureId, title, introduction, price }: LectureUpdateRequest = lectureUpdateRequest;
    const lecture: Lecture | null = await this._lectureRepository.findById(lectureId, connection!);
    if (!lecture) {
      throw new NotFoundException(`존재하지 않는 강의 ID(${lectureId}) 입니다`);
    }

    const updatedLecture: Lecture = lecture.update(title, introduction, price);
    await this._lectureRepository.update(updatedLecture, connection!);
  }

  private async _processSingleLectureCreateRequest(
    request: LectureCreateRequest,
    connection: PoolConnection,
  ): Promise<LectureBulkCreateResponseItem> {
    try {
      const response: LectureCreateResponse = await this.createLecture(request, connection);
      return LectureBulkCreateResponseItem.createWithSuccess(response.id, response.title);
    } catch (error) {
      if (error instanceof Error) {
        return LectureBulkCreateResponseItem.createWithFail(request.title, error);
      }
      return LectureBulkCreateResponseItem.createWithFail(request.title, new Error('알 수 없는 에러'));
    }
  }
}
