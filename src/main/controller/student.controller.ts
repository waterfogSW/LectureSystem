import { inject, injectable } from 'inversify';
import { StudentService } from '../service/student.service';
import TYPES from '../common/type/types';
import { Request, Response } from 'express';
import { StudentCreateResponse } from './dto/student.dto';

@injectable()
export class StudentController {

  constructor(
    @inject(TYPES.StudentService) private readonly _studentService: StudentService,
  ) {}


  public async createStudent(
    req: Request,
    res: Response,
  ) {
    const { nickname, email } = req.body;
    const student = await this._studentService.createStudent(nickname, email);
    const response: StudentCreateResponse = StudentCreateResponse.from(student);
    res.status(201).json(response);
  }

}
