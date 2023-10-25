import { inject, injectable } from 'inversify';
import { StudentService } from '../service/student.service';
import TYPES from '../common/type/types';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../common/constant/http-status.constant';
import { Student } from '../model/student.model';
import { StudentDTOMapper } from './mapper/StudentDTOMapper';
import { StudentCreateResponse } from './dto/StudentCreateResponse';

@injectable()
export class StudentController {

  constructor(
    @inject(TYPES.StudentService) private readonly _studentService: StudentService,
    @inject(TYPES.StudentDTOMapper) private readonly _studentDTOMapper: StudentDTOMapper,
  ) {}


  public async createStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { nickname, email } = request.body;
    const student: Student = await this._studentService.createStudent(nickname, email);
    const body: StudentCreateResponse = this._studentDTOMapper.toStudentCreateResponse(student);
    response
      .status(HTTP_STATUS.CREATED)
      .json(body);
  }

}
