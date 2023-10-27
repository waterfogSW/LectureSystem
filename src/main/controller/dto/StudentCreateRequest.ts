import { IsString } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';

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
}
