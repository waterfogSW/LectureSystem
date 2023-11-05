import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Request } from 'express';
import { LectureCategory } from '../../domain/LectureCategory';
import { validateClass } from '../../../common/util/ClassValidateUtil';
import { parseEnum } from '../../../common/util/EnumUtil';

export class LectureCreateRequest {

  @IsString()
  private readonly _title: string;

  @IsString()
  private readonly _introduction: string;

  @IsNumber()
  private readonly _instructorId: number;

  @IsEnum(LectureCategory, { message: '유효하지 않은 카테고리 입니다' })
  private readonly _category: LectureCategory;

  @IsNumber()
  private readonly _price: number;

  constructor(
    title: string,
    introduction: string,
    instructorId: number,
    category: LectureCategory,
    price: number,
  ) {
    this._title = title;
    this._introduction = introduction;
    this._instructorId = instructorId;
    this._category = category;
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

  public get category(): LectureCategory {
    return this._category;
  }

  public get price(): number {
    return this._price;
  }

  public static from(request: Request): LectureCreateRequest {
    const { title, introduction, instructorId, category, price } = request.body;

    return new LectureCreateRequest(
      title,
      introduction,
      instructorId,
      parseEnum(category.toUpperCase(), LectureCategory),
      price,
    );
  }

  public static of(
    title: string,
    introduction: string,
    instructorId: number,
    category: string,
    price: number,
  ): LectureCreateRequest {
    const categoryEnum: LectureCategory = parseEnum(category.toUpperCase(), LectureCategory);
    return new LectureCreateRequest(title, introduction, instructorId, categoryEnum, price);
  }
}
