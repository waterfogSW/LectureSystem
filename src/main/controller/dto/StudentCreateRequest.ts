import { IsString } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';
import { Request } from 'express';

export class StudentCreateRequest {

  @IsString()
  private readonly _nickname: string;

  @IsString()
  private readonly _email: string;

  constructor(
    nickname: string,
    email: string,
  ) {
    this._nickname = nickname;
    this._email = email;
    validateClass(this);
  }

  get nickname(): string {
    return this._nickname;
  }

  get email(): string {
    return this._email;
  }

  public static from(request: Request): StudentCreateRequest {
    const { nickname, email } = request.body;
    return new StudentCreateRequest(nickname, email);
  }
}
