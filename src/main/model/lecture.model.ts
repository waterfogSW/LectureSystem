import { BaseModel } from './base.model';
import { IsNumber } from 'class-validator';

export class Lecture extends BaseModel {

  @IsNumber()
  private readonly _instructorId: number;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _price: number;
  private readonly _category: LectureCategory;
  private readonly _is_published: boolean;

  constructor(
    id: number,
    instructor: number,
    title: string,
    description: string,
    price: number,
    category: LectureCategory,
    is_published: boolean,
  ) {
    super(id);
    this._instructorId = instructor;
    this._title = title;
    this._description = description;
    this._price = price;
    this._category = category;
    this._is_published = is_published;
  }
}

export const enum LectureCategory {
  WEB = 'WEB',
  APP = 'APP',
  GAME = 'GAME',
  ALGORITHM = 'ALGORITHM',
  INFRA = 'INFRA',
  DATABASE = 'DATABASE',
}
