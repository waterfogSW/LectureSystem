import { IsEmail, IsString, Length } from 'class-validator';
import { BaseEntity, Id } from '../../common/entity/BaseEntity';
import { validateClass } from '../../common/util/ClassValidateUtil';

export class Student extends BaseEntity {

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @Length(3, 10, { message: '닉네임의 길이는 3글자 이상, 10글자 미만이어야 합니다.' })
  private readonly _nickname: string;

  @IsEmail({}, { message: '잘못된 이메일 형식입니다.' })
  private readonly _email: string;

  constructor(
    id: Id,
    nickname: string,
    email: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._nickname = nickname;
    this._email = email;
    validateClass(this);
  }

  public get nickname(): string {
    return this._nickname;
  }

  public get email(): string {
    return this._email;
  }

  public static create(
    nickname: string,
    email: string,
  ): Student {
    return new Student(undefined, nickname, email);
  }

  public static createUnknown(): Student {
    return new Student(undefined, '알수없음.', 'unknown@email.com');
  }
}
