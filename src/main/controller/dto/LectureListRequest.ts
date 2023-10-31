import { LectureCategory, LectureOrderType, LectureSearchType } from '../../domain/LectureEnums';
import { Request } from 'express';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';
import { parseEnum } from '../../common/util/EnumUtil';

export class LectureListRequest {

  @IsOptional()
  @IsPositive({ message: '페이지는 양수여야 합니다.' })
  private readonly _page: number;

  @IsOptional()
  @IsPositive({ message: '페이지 사이즈는 양수여야 합니다.' })
  private readonly _pageSize: number;

  @IsOptional()
  @IsEnum(LectureOrderType, { message: '유효하지 않은 정렬타입 입니다.' })
  private readonly _order: LectureOrderType;

  @IsOptional()
  @IsEnum(LectureCategory, { message: '유효하지 않은 카테고리 타입 입니다.' })
  private readonly _category?: LectureCategory;

  @IsOptional()
  @IsEnum(LectureSearchType, { message: '유효하지 않은 검색타입 입니다.' })
  private readonly _searchType?: LectureSearchType;

  @IsOptional()
  @IsString({ message: '검색어는 문자열이어야 합니다.' })
  private readonly _searchKeyword?: string;

  constructor(
    page: number = 1,
    size: number = 10,
    order: LectureOrderType = LectureOrderType.RECENT,
    category?: LectureCategory,
    searchType?: string,
    searchKeyword?: string,
  ) {
    this._page = page;
    this._pageSize = size;
    this._order = order;
    this._category = category;
    this._searchType = searchType ? parseEnum(searchType, LectureSearchType) : undefined;
    this._searchKeyword = searchKeyword;
    validateClass(this);
  }

  public get page(): number {
    return this._page;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get order(): LectureOrderType {
    return this._order;
  }

  public get category(): LectureCategory | undefined {
    return this._category;
  }

  public get searchType(): LectureSearchType | undefined {
    return this._searchType;
  }

  public get searchKeyword(): string | undefined {
    return this._searchKeyword;
  }

  public static from(request: Request): LectureListRequest {
    const { page, pageSize, order, category, searchType, searchKeyword }: any = request.query;
    return new LectureListRequest(
      Number(page),
      Number(pageSize),
      order ? parseEnum(order.toUpperCase(), LectureOrderType) : undefined,
      category ? parseEnum(category.toUpperCase(), LectureCategory) : undefined,
      searchType ? parseEnum(searchType.toUpperCase(), LectureSearchType) : undefined,
      searchKeyword,
    );
  }
}
