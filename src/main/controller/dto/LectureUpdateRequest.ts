import { IsOptional, IsPositive } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';
import { Request } from 'express';

export class LectureUpdateRequest {

  @IsPositive({ message: '강의 아이디는 0보다 커야 합니다.' })
  private readonly _lectureId: number;

  @IsOptional()
  private readonly _title?: string;

  @IsOptional()
  private readonly _introduction?: string;

  @IsOptional()
  private readonly _price?: number;


  constructor(
    lectureId: number,
    title?: string,
    introduction?: string,
    price?: number,
  ) {
    this._lectureId = lectureId;
    this._title = title;
    this._introduction = introduction;
    this._price = price;
    validateClass(this);
  }


  public get lectureId(): number {
    return this._lectureId;
  }

  public get title(): string | undefined {
    return this._title;
  }

  public get introduction(): string | undefined {
    return this._introduction;
  }

  public get price(): number | undefined {
    return this._price;
  }

  public static from(request: Request): LectureUpdateRequest {
    const lectureId: number = Number(request.params.id);
    const { title, introduction, price } = request.body;

    return new LectureUpdateRequest(
      lectureId,
      title,
      introduction,
      price,
    );
  }

}
