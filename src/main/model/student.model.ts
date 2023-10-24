import { BaseModel } from './base.model';

export class Student extends BaseModel {

  private readonly _nickname: string;
  private readonly _email: string;

  public get nickname(): string {
    return this._nickname;
  }

  public get email(): string {
    return this._email;
  }

  constructor(
    nickname: string,
    email: string,
    id?: number,
  ) {
    super(id);
    this._nickname = nickname;
    this._email = email;
  }

}
