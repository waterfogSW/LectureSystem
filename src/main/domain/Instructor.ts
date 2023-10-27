import { BaseModel, Id } from '../common/model/BaseModel';
import { IsString, Length, validateSync, ValidationError } from 'class-validator';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';

export class Instructor extends BaseModel {
  @IsString()
  @Length(1, 20)
  private readonly _name: string;

  constructor(
    id: Id,
    name: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    const errors: ValidationError[] = validateSync(this);
    if (errors.length > 0) {
      throw new IllegalArgumentException(errors[0].toString());
    }
  }

  public static create(
    name: string,
  ): Instructor {
    return new Instructor(undefined, name);
  }
}
