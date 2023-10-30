import { BaseEntity, Id } from '../common/entity/BaseEntity';
import { IsPositive } from 'class-validator';
import { validateClass } from '../common/util/ClassValidateUtil';

export class Enrollment extends BaseEntity {

  @IsPositive({ message: '강의 아이디는 0보다 커야 합니다.' })
  private readonly _lectureId: number;

  @IsPositive({ message: '학생 아이디는 0보다 커야 합니다.' })
  private readonly _studentId: number;

  constructor(
    id: Id,
    lectureId: number,
    studentId: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    this._lectureId = lectureId;
    this._studentId = studentId;
    validateClass(this);
  }

  public get lectureId(): number {
    return this._lectureId;
  }

  public get studentId(): number {
    return this._studentId;
  }

  public static create(
    lectureId: number,
    studentId: number,
  ): Enrollment {
    return new Enrollment(undefined, lectureId, studentId);
  }
}
