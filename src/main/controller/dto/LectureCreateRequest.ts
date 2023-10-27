import { IsEnum, IsNumber, IsString } from 'class-validator';
import { LectureCategory, LectureCategoryNames } from '../../domain/LectureCategory';
import { validateClass } from '../../common/util/ClassValidateUtil';

export class LectureCreateRequest {

  @IsString()
  private readonly _title: string;

  @IsString()
  private readonly _introduction: string;

  @IsNumber()
  private readonly _instructorId: number;

  @IsEnum(LectureCategory, { message: '유효하지 않은 카테고리 입니다' })
  private readonly _category: LectureCategoryNames;

  @IsNumber()
  private readonly _price: number;

  constructor(
    title: string,
    introduction: string,
    instructorId: number,
    category: string,
    price: number,
  ) {
    this._title = title;
    this._introduction = introduction;
    this._instructorId = instructorId;
    this._category = category as LectureCategoryNames;
    this._price = price;
    validateClass(this);
  }

  public get title(): string {
    return this._title;
  }

  public get introduction(): string {
    return this._introduction;
  }

  public get instructorId(): number {
    return this._instructorId;
  }

  public get category(): LectureCategoryNames {
    return this._category;
  }

  public get price(): number {
    return this._price;
  }
}
