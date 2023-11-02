import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/Transactional';
import { BindingTypes } from '../common/constant/BindingTypes';
import { StudentCreateRequest } from '../controller/dto/StudentCreateRequest';
import { StudentCreateResponse } from '../controller/dto/StudentCreateResponse';
import { StudentService } from '../service/StudentService';
import { EnrollmentService } from '../service/EnrollementSerivce';
import { StudentDeleteRequest } from '../controller/dto/StudentDeleteRequest';

@injectable()
export class StudentFacade {
  constructor(
    @inject(BindingTypes.EnrollmentService)
    private readonly _enrollmentService: EnrollmentService,
    @inject(BindingTypes.StudentService)
    private readonly _studentService: StudentService,
  ) {}

  @transactional()
  public async createStudent(
    request: StudentCreateRequest,
    connection?: PoolConnection,
  ): Promise<StudentCreateResponse> {
    return await this._studentService.create(request, connection!);
  }

  @transactional()
  public async deleteStudent(
    { studentId }: StudentDeleteRequest,
    connection?: PoolConnection,
  ): Promise<void> {
    await this._enrollmentService.deleteAllByStudentId(studentId, connection!);
    await this._studentService.deleteById(studentId, connection!);
  }
}
