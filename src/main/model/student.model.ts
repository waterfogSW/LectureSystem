import { BaseModel } from './base.model';

export class Student extends BaseModel {

  private readonly _nickname: string;
  private readonly _email: string;

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
