import { IsPositive } from 'class-validator';
import { Request } from 'express';
import { validateClass } from '../../../common/util/ClassValidateUtil';

export class StudentDeleteRequest {

  @IsPositive({ message: '학생 아이디는 0보다 큰 숫자여야 합니다.' })
  private readonly _studentId: number;

  constructor(studentId: number) {
    this._studentId = studentId;
    validateClass(this);
  }

  public get studentId(): number {
    return this._studentId;
  }

  public static from(request: Request): StudentDeleteRequest {
    const studentId: number = Number(request.params.id);
    return new StudentDeleteRequest(studentId);
  }

}
