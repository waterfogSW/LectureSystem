import { Request } from 'express';
import { IsPositive } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';

export class LecturePublishRequest {

  @IsPositive({ message: '강의 ID는 양수여야 합니다.' })
  private readonly _lectureId: number;

  constructor(lectureId: number) {
    this._lectureId = lectureId;
    validateClass(this);
  }


  public get lectureId(): number {
    return this._lectureId;
  }

  public static from(request: Request): LecturePublishRequest {
    const lectureId: number = Number(request.params.id);
    return new LecturePublishRequest(lectureId);
  }
}
