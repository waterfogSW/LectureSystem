import { BaseModel, Id } from '../common/model/BaseModel';
import { IsEmail, IsString, Length, validateSync, ValidationError } from 'class-validator';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';

export class Student extends BaseModel {

  @IsString()
  @Length(3, 20)
  private readonly _nickname: string;

  @IsEmail()
  private readonly _email: string;

  constructor(
    id: Id,
    nickname: string,
    email: string,
  ) {
    super(id);
    this._nickname = nickname;
    this._email = email;
    const errors: ValidationError[] = validateSync(this);
    if (errors.length > 0) {
      throw new IllegalArgumentException(errors[0].toString());
    }
  }

  public get nickname(): string {
    return this._nickname;
  }

  public get email(): string {
    return this._email;
  }

  static create(
    nickname: string,
    email: string,
  ): Student {
    return new Student(undefined, nickname, email);
  }
}
