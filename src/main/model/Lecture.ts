import { BaseModel, Id } from '../common/model/BaseModel';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  validateSync,
  ValidationError,
} from 'class-validator';
import { LectureCategory, LectureCategoryNames } from './LectureCategory';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';

export class Lecture extends BaseModel {

  @IsNumber()
  private readonly _instructorId: Id;

  @IsString()
  @Length(1, 20)
  private readonly _title: string;

  @IsString()
  @Length(1, 5000)
  private readonly _description: string;

  @IsNumber()
  @IsPositive()
  private readonly _price: number;

  @IsEnum(LectureCategory)
  private readonly _category: LectureCategoryNames;

  @IsBoolean()
  private readonly _is_published: boolean;

  constructor(
    id: Id,
    instructor: number,
    title: string,
    description: string,
    price: number,
    category: LectureCategoryNames,
    is_published?: boolean,
  ) {
    super(id);
    this._instructorId = instructor;
    this._title = title;
    this._description = description;
    this._price = price;
    this._category = category;
    this._is_published = is_published || false;
    const errors: ValidationError[] = validateSync(this);
    if (errors.length > 0) {
      throw new IllegalArgumentException(errors[0].toString());
    }
  }

  public static create(
    instructorId: number,
    title: string,
    description: string,
    price: number,
    category: LectureCategoryNames,
  ): Lecture {
    return new Lecture(undefined, instructorId, title, description, price, category);
  }

}
