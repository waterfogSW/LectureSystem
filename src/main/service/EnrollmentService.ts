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

    const set: Set<Id> = new Set(lectureIds);
    if (set.size !== lectureIds.length) {
      throw new IllegalArgumentException('중복된 강의가 포함되어 있습니다.');
    }

    const [student, lectures]: [Student | null, Array<Lecture | null>] = await Promise.all([
        this._studentRepository.findById(studentId, connection!),
        Promise.all(lectureIds.map((lectureId: number) => this._lectureRepository.findById(lectureId, connection!))),
      ],
    );

    if (!student) {
      throw new NotFoundException(`존재하지 않는 학생(id=${ studentId })입니다`);
    }

    const foundLectureIds: Array<Id> = lectures
      .filter((lecture: Lecture | null): lecture is Lecture => lecture !== null)
      .map((lecture: Lecture) => lecture.id);

    const notFoundLectureIds: Array<Id> = lectureIds.filter((lectureId: Id) => !foundLectureIds.includes(lectureId));

    if (notFoundLectureIds.length > 0) {
      throw new NotFoundException(`존재하지 않는 강의(id=${ notFoundLectureIds.join(',') })가 포함되어 있습니다.`);
    }
    const foundEnrollments: Array<Enrollment | null> = await Promise.all(
      foundLectureIds
        .map((lectureId: Id) => this._enrollmentRepository.findByLectureIdAndStudentId(lectureId!, studentId, connection!))
    );

    const foundEnrollmentIds: Array<Id> = foundEnrollments
      .filter((enrollment: Enrollment | null): enrollment is Enrollment => enrollment !== null)
      .map((enrollment: Enrollment) => enrollment.lectureId);

    if (foundEnrollmentIds.length > 0) {
      throw new IllegalArgumentException(`이미 수강중인 강의(id=${ foundEnrollmentIds.join(',') })가 포함되어 있습니다.`);
    }

    const newEnrollments: Array<Enrollment> = await Promise.all(
      foundLectureIds.map((lectureId: Id) => Enrollment.create(lectureId!, studentId)),
    );

    const createdEnrollments: Array<Enrollment> = await Promise.all(
      newEnrollments.map((enrollment: Enrollment) => this._enrollmentRepository.save(enrollment, connection!)),
    );

    return EnrollmentCreateResponse.from(createdEnrollments);
  }
}
