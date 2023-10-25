import { BaseModel } from './BaseModel';

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
