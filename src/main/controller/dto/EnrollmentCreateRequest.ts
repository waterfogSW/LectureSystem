import { IsArray, IsPositive, validate } from 'class-validator';
import { Request } from 'express';
import { IsPositiveNumberArray, validateClass } from '../../common/util/ClassValidateUtil';

export class EnrollmentCreateRequest {

  @IsArray({ message: '강의 ID는 배열이어야 합니다.' })
  @IsPositiveNumberArray({ message: '강의 ID는 0보다 커야 합니다.' })
  private readonly _lectureIds: Array<number>;

  @IsPositive({ message: '수강생 ID는 0보다 커야 합니다.' })
  private readonly _studentId: number;

  constructor(
    lectureIds: Array<number>,
    studentId: number,
  ) {
    this._lectureIds = lectureIds;
    this._studentId = studentId;
    validateClass(this);
  }

  public get lectureIds(): Array<number> {
    return this._lectureIds;
  }

  public get studentId(): number {
    return this._studentId;
  }

  public static from(request: Request): EnrollmentCreateRequest {
    const lectureIds: Array<number> = request.body.lectureIds.map((lectureId: any) => Number(lectureId));
    const studentId: number = Number(request.body.studentId);
    return new EnrollmentCreateRequest(lectureIds, studentId);
  }
}
