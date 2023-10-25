import { inject, injectable } from 'inversify';
import { StudentService } from '../service/student.service';
import TYPES from '../common/type/types';
import { Request, Response } from 'express';
import { StudentCreateResponse } from './dto/student.dto';
import { HTTP_STATUS } from '../common/constant/http-status.constant';
import { Student } from '../model/student.model';

@injectable()
export class StudentController {

  constructor(
    @inject(TYPES.StudentService) private readonly _studentService: StudentService,
  ) {}


  public async createStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { nickname, email } = request.body;
    const student: Student = await this._studentService.createStudent(nickname, email);
    const responseBody: StudentCreateResponse = StudentCreateResponse.from(student);
    response
      .status(HTTP_STATUS.CREATED)
      .json(responseBody);
  }

}
