import { inject, injectable } from 'inversify';
import { StudentService } from '../service/StudentService';
import { type Request, type Response } from 'express';
import { HTTP_STATUS } from '../common/constant/HttpStatus';
import { type Student } from '../domain/Student';
import { StudentCreateResponse } from './dto/StudentCreateResponse';
import { BindingTypes } from '../common/constant/BindingTypes';
import { StudentCreateRequest } from './dto/StudentCreateRequest';

@injectable()
export class StudentController {
  constructor(
    @inject(BindingTypes.StudentService) private readonly _studentService: StudentService,
  ) {}

  public async createStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const studentCreateRequest: StudentCreateRequest = StudentCreateRequest.from(request);
    const studentCreateResponse: StudentCreateResponse = await this._studentService.createStudent(studentCreateRequest);
    response
      .status(HTTP_STATUS.CREATED)
      .json(studentCreateResponse);
  }

  public async deleteStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    const parsedId: number = parseInt(id, 10);
    await this._studentService.deleteStudent(parsedId);
    response
      .status(HTTP_STATUS.OK)
      .send();
  }
}
