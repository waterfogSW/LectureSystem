import { inject, injectable } from 'inversify';
import { StudentFacade } from '../facade/StudentFacade';
import { type Request, type Response } from 'express';
import { HttpStatus } from '../common/constant/HttpStatus';
import { StudentCreateResponse } from './dto/StudentCreateResponse';
import { BindingTypes } from '../common/constant/BindingTypes';
import { StudentCreateRequest } from './dto/StudentCreateRequest';

@injectable()
export class StudentController {
  constructor(
    @inject(BindingTypes.StudentFacade)
    private readonly _studentFacade: StudentFacade,
  ) {}

  public async createStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const studentCreateRequest: StudentCreateRequest = StudentCreateRequest.from(request);
    const studentCreateResponse: StudentCreateResponse = await this._studentFacade.createStudent(studentCreateRequest);
    response
      .status(HttpStatus.CREATED)
      .json(studentCreateResponse);
  }

  public async deleteStudent(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    const parsedId: number = parseInt(id, 10);
    await this._studentFacade.deleteStudent(parsedId);
    response
      .status(HttpStatus.OK)
      .send();
  }
}
