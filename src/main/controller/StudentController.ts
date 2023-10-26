import { inject, injectable } from 'inversify';
import { StudentService } from '../service/StudentService';
import { type Request, type Response } from 'express';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { type Student } from '../model/Student';
import { StudentDTOMapper } from '../mapper/StudentDTOMapper';
import { type StudentCreateResponse } from './dto/StudentCreateResponse';
import { BindingTypes } from '../common/constant/BindingTypes';

@injectable()
export class StudentController {
  constructor(
    @inject(BindingTypes.StudentService) private readonly _studentService: StudentService,
    @inject(BindingTypes.StudentDTOMapper) private readonly _studentDTOMapper: StudentDTOMapper,
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

  public async deleteStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    await this._studentService.deleteStudent(parseInt(id));
    response
      .status(HTTP_STATUS.OK)
      .send();
  }
}
