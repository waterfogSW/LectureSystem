import { BaseModel, Id } from '../common/model/BaseModel';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
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

  @IsString()
  @Length(1, 20)
  private readonly _title: string;

  @IsString()
  @Length(1, 5000)
  private readonly _introduction: string;

  @IsNumber()
  private readonly _instructorId: Id;

  @IsNotEmpty()
  @IsEnum(LectureCategory)
  private readonly _category: LectureCategoryNames;

  @IsNumber()
  @IsPositive()
  private readonly _price: number;

  @IsBoolean()
  private readonly _is_published: boolean;


  constructor(
    id: Id,
    title: string,
    introduction: string,
    instructorId: number,
    category: string,
    price: number,
    is_published?: boolean,
  ) {
    super(id);
    this._instructorId = instructorId;
    this._title = title;
    this._introduction = introduction;
    this._price = price;
    this._category = category.toUpperCase() as LectureCategoryNames;
    this._is_published = is_published || false;
    this.validate();
  }

  public get title(): string {
    return this._title;
  }

  public get introduction(): string {
    return this._introduction;
  }

  public get instructorId(): Id {
    return this._instructorId;
  }

  public get category(): LectureCategoryNames {
    return this._category;
  }

  public get price(): number {
    return this._price;
  }

  get is_published(): boolean {
    return this._is_published;
  }

  public static create(
    title: string,
    introduction: string,
    instructorId: number,
    category: string,
    price: number,
  ): Lecture {
    return new Lecture(undefined, title, introduction, instructorId, category, price);
  }

  private validate(): void {
    const errors: ValidationError[] = validateSync(this);
    if (errors.length > 0) {
      throw new IllegalArgumentException(errors[0].toString());
    }
  }

}
