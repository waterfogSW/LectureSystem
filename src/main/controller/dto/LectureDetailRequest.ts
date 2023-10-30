import { IsPositive } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';
import { Request } from 'express';

export class LectureDetailRequest {

  @IsPositive({ message: '강의 아이디는 0보다 커야 합니다.' })
  private readonly _lectureId: number;

  constructor(lectureId: number) {
    this._lectureId = lectureId;
    validateClass(this);
  }

  public get lectureId(): number {
    return this._lectureId;
  }

  public static from(request: Request): LectureDetailRequest {
    const lectureId: number = Number(request.params.id);
    return new LectureDetailRequest(lectureId);
  }

}
