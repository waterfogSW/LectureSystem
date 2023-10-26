import { BaseModel, Id } from '../common/model/BaseModel';
import { IsBoolean, IsEnum, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { LectureCategory, LectureCategoryNames } from './LectureCategory';

export class Lecture extends BaseModel {

  @IsString()
  @Length(1, 20)
  private readonly _title: string;

  @IsString()
  @Length(1, 5000)
  private readonly _introduction: string;

  @IsNumber()
  private readonly _instructorId: Id;

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
    category: LectureCategoryNames,
    price: number,
    is_published?: boolean,
  ) {
    super(id);
    this._instructorId = instructorId;
    this._title = title;
    this._introduction = introduction;
    this._price = price;
    this._category = category;
    this._is_published = is_published || false;
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
    category: LectureCategoryNames,
    price: number,
  ): Lecture {
    return new Lecture(undefined, title, introduction, instructorId, category, price);
  }

}
