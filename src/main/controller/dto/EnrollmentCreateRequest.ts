import { ArrayMinSize, IsArray, IsPositive } from 'class-validator';
import { Request } from 'express';
import { IsPositiveNumberArray, validateClass } from '../../common/util/ClassValidateUtil';
import { IllegalArgumentException } from '../../common/exception/IllegalArgumentException';

export class EnrollmentCreateRequest {

  @IsArray({ message: '강의 ID는 배열이어야 합니다.' })
  @ArrayMinSize(1, { message: '강의 ID는 최소 1개 이상이어야 합니다.' })
  @IsPositiveNumberArray({ message: '강의 ID는 0보다 큰 숫자여야 합니다' })
  private readonly _lectureIds: Array<number>;

  @IsPositive({ message: '수강생 ID는 0보다 큰 숫자여야 합니다.' })
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
    if (!Array.isArray(request.body.lectureIds)) {
      throw new IllegalArgumentException('강의 ID는 배열이어야 합니다.');
    }

    const lectureIds: Array<number> = request.body.lectureIds.map((lectureId: any) => Number(lectureId));
    const studentId: number = Number(request.body.studentId);
    return new EnrollmentCreateRequest(lectureIds, studentId);
  }
}
