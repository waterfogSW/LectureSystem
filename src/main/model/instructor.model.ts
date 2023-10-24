import { BaseModel } from './base.model';

export class Instructor extends BaseModel {

  private readonly _name: string;

  constructor(
    name: string,
    id?: number,
  ) {
    super(id);
    this._name = name;
  }

}
