import { BaseEntity, Id } from '../common/entity/BaseEntity';
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
import { LectureCategory } from './LectureEnums';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';

export class Lecture extends BaseEntity {

  @IsString({ message: '강의 제목은 문자열이어야 합니다.' })
  @Length(3, 50, { message: '강의 제목은 3글자 이상, 50글자 미만이어야 합니다.' })
  private readonly _title: string;

  @IsString({ message: '강의 소개는 문자열이어야 합니다.' })
  @Length(1, 5000, { message: '강의 소개는 1글자 이상, 5000글자 미만이어야 합니다.' })
  private readonly _introduction: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: '강사 아이디는 숫자여야 합니다.' })
  @IsPositive({ message: '강사 아이디는 1이상이어야 합니다.' })
  private readonly _instructorId: number;

  @IsEnum(LectureCategory, { message: '존재하지 않는 강의 카테고리입니다.' })
  private readonly _category: LectureCategory;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: '강의 가격은 숫자여야 합니다.' })
  @IsPositive({ message: '강의 가격은 0보다 커야 합니다.' })
  private readonly _price: number;

  @IsBoolean({ message: '잘못된 강의 공개여부 형식입니다.' })
  private readonly _is_published: boolean;

  constructor(
    id: Id,
    title: string,
    introduction: string,
    instructorId: number,
    category: string,
    price: number,
    createdAt?: Date,
    updatedAt?: Date,
    is_published?: boolean,
  ) {
    super(id, createdAt, updatedAt);
    this._instructorId = instructorId;
    this._title = title;
    this._introduction = introduction;
    this._price = price;
    this._category = category.toUpperCase() as LectureCategory;
    this._is_published = is_published || false;
    this.validate();
  }

  public update(
    title?: string,
    introduction?: string,
    price?: number,
  ): Lecture {
    return new Lecture(
      this.id,
      title ? title : this.title,
      introduction ? introduction : this.introduction,
      this.instructorId,
      this.category,
      price ? price : this.price,
      this.createdAt,
      new Date(),
      this.is_published,
    );
  }

  public publish(): Lecture {
    return new Lecture(
      this.id,
      this.title,
      this.introduction,
      this.instructorId,
      this.category,
      this.price,
      this.createdAt,
      new Date(),
      true,
    );
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

  public get is_published(): boolean {
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
