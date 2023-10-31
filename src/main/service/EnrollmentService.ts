import { inject, injectable } from 'inversify';
import { EnrollmentRepository } from '../repository/EnrollmentRepository';
import { EnrollmentCreateRequest } from '../controller/dto/EnrollmentCreateRequest';
import { transactional } from '../common/decorator/Transactional';
import { PoolConnection } from 'mysql2/promise';
import { StudentRepository } from '../repository/StudentRepository';
import { LectureRepository } from '../repository/LectureRepository';
import { NotFoundException } from '../common/exception/NotFoundException';
import { Student } from '../domain/Student';
import { Lecture } from '../domain/Lecture';
import { Enrollment } from '../domain/Enrollment';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';
import { EnrollmentCreateResponse } from '../controller/dto/EnrollmentCreateResponse';
import { BindingTypes } from '../common/constant/BindingTypes';
import { Id } from '../common/entity/BaseEntity';


@injectable()
export class EnrollmentService {

  private readonly _enrollmentRepository: EnrollmentRepository;
  private readonly _studentRepository: StudentRepository;
  private readonly _lectureRepository: LectureRepository;


  constructor(
    @inject(BindingTypes.EnrollmentRepository)
      enrollmentRepository: EnrollmentRepository,
    @inject(BindingTypes.StudentRepository)
      studentRepository: StudentRepository,
    @inject(BindingTypes.LectureRepository)
      lectureRepository: LectureRepository,
  ) {
    this._enrollmentRepository = enrollmentRepository;
    this._studentRepository = studentRepository;
    this._lectureRepository = lectureRepository;
  }

  @transactional()
  public async createEnrollment(
    enrollmentCreateRequest: EnrollmentCreateRequest,
    connection?: PoolConnection,
  ): Promise<EnrollmentCreateResponse> {
    const { lectureIds, studentId }: EnrollmentCreateRequest = enrollmentCreateRequest;

    await Promise.all([
      this._ensureNoDuplicateLectureIds(lectureIds),
      this._ensureStudentExists(studentId, connection!),
      this._ensureAllLecturesExist(lectureIds, connection!),
      this._ensureNoEnrollmentExists(lectureIds, studentId, connection!),
    ]);

    const newEnrollments: Array<Enrollment> = lectureIds.map((lectureId: Id) => Enrollment.create(lectureId!, studentId));
    const createdEnrollments: Array<Enrollment> = await Promise.all(newEnrollments.map((enrollment: Enrollment) => this._enrollmentRepository.save(enrollment, connection!)));

    return EnrollmentCreateResponse.from(createdEnrollments);
  }

  private async _ensureNoDuplicateLectureIds(lectureIds: Array<Id>): Promise<void> {
    const set: Set<Id> = new Set(lectureIds);
    if (set.size !== lectureIds.length) {
      throw new IllegalArgumentException('중복된 강의가 포함되어 있습니다.');
    }
  }

  private async _ensureStudentExists(
    studentId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const student: Student | null = await this._studentRepository.findById(studentId, connection);
    if (student === null) {
      throw new NotFoundException(`존재하지 않는 학생(id=${ studentId })입니다`);
    }
  }

  private async _ensureAllLecturesExist(
    lectureIds: Array<Id>,
    connection: PoolConnection,
  ): Promise<void> {
    const lectures: Array<Lecture | null> = await Promise.all(
      lectureIds.map((lectureId: Id) => this._lectureRepository.findById(lectureId!, connection)),
    );
    const notFoundLectureIds: Array<Id> = lectures
      .filter((lecture: Lecture | null): lecture is null => lecture === null)
      .map((lecture: Lecture | null) => lecture!.id);
    if (notFoundLectureIds.length > 0) {
      throw new NotFoundException(`존재하지 않는 강의(id=${ notFoundLectureIds.join(',') })가 포함되어 있습니다.`);
    }
  }

  private async _ensureNoEnrollmentExists(
    lectureIds: Array<number>,
    studentId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const enrollments: Array<Enrollment | null> = await Promise.all(
      lectureIds.map((lectureId: Id) => this._enrollmentRepository.findByLectureIdAndStudentId(lectureId!, studentId, connection)),
    );
    const foundEnrollments: Array<Enrollment> = enrollments.filter((enrollment: Enrollment | null): enrollment is Enrollment => enrollment !== null);
    if (foundEnrollments.length > 0) {
      throw new IllegalArgumentException(`이미 수강중인 강의(id=${ foundEnrollments.map((enrollment: Enrollment) => enrollment.lectureId).join(',') })가 포함되어 있습니다.`);
    }
  }
}
