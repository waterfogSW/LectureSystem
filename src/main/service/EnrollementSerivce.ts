import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { EnrollmentRepository } from '../repository/EnrollmentRepository';
import { BindingTypes } from '../common/constant/BindingTypes';
import { PoolConnection } from 'mysql2/promise';
import { Enrollment } from '../domain/Enrollment';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';
import { LectureStudentCountRepository } from '../repository/LectureStudentCountRepository';
import { NotFoundException } from '../common/exception/NotFoundException';

@injectable()
export class EnrollmentService {

  constructor(
    @inject(BindingTypes.EnrollmentRepository)
    private readonly _enrollmentRepository: EnrollmentRepository,
    @inject(BindingTypes.LectureStudentCountRepository)
    private readonly _lectureStudentCountRepository: LectureStudentCountRepository,
  ) {}

  public async findAllByLectureId(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<Array<Enrollment>> {
    return await this._enrollmentRepository.findAllByLectureId(lectureId, connection);
  }

  public async findByLectureIdAndStudentId(
    lectureId: number,
    studentId: number,
    connection: PoolConnection,
  ): Promise<Enrollment> {
    const findEnrollment: Enrollment | null = await this._enrollmentRepository.findByLectureIdAndStudentId(lectureId, studentId, connection);
    if (findEnrollment === null) {
      throw new NotFoundException(`존재하지 않는 강의 내역(id=${ lectureId }, studentId=${ studentId })입니다`);
    }
    return findEnrollment;
  }

  public async validateNoEnrollmentAlreadyExists(
    lectureIds: Array<number>,
    studentId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const foundEnrollments: Array<Enrollment> = [];
    await Promise.all(
      lectureIds.map(async (lectureId: number) => {
        try {
          const enrollment: Enrollment = await this.findByLectureIdAndStudentId(lectureId, studentId, connection);
          foundEnrollments.push(enrollment);
        } catch (error) {
          if (!(error instanceof NotFoundException)) {
            throw error;
          }
        }
      }),
    );

    if (foundEnrollments.length > 0) {
      throw new IllegalArgumentException(`이미 수강중인 강의(id=${ foundEnrollments.map((enrollment: Enrollment) => enrollment.lectureId).join(',') })가 포함되어 있습니다.`);
    }
  }

  public async create(
    lectureId: number,
    studentId: number,
    connection: PoolConnection,
  ): Promise<Enrollment> {
    const newEnrollment: Enrollment = Enrollment.create(lectureId, studentId);

    const [savedEnrollment]: [Enrollment, void] = await Promise.all([
      this._enrollmentRepository.save(newEnrollment, connection),
      this._lectureStudentCountRepository.increment(lectureId, connection),
    ]);

    return savedEnrollment;
  }

  public async deleteAllByStudentId(
    studentId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const enrollments: Array<Enrollment> = await this._enrollmentRepository.findAllByStudentId(studentId, connection);

    const lectureDecrementTasks: Array<Promise<void>> = enrollments.map((enrollment) =>
      this._lectureStudentCountRepository.decrement(enrollment.lectureId, connection),
    );
    const deleteByIdTasks: Array<Promise<void>> = enrollments.map((enrollment) =>
      this._enrollmentRepository.deleteById(enrollment.id!, connection),
    );

    await Promise.all([...lectureDecrementTasks, ...deleteByIdTasks]);
  }

  public async deleteAllByLectureId(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const enrollments: Array<Enrollment> = await this._enrollmentRepository.findAllByLectureId(lectureId, connection);

    const deleteByIdTasks: Array<Promise<void>> = enrollments.map((enrollment) =>
      this._enrollmentRepository.deleteById(enrollment.id!, connection),
    );

    await Promise.all(deleteByIdTasks);
  }

}
