import {
  LectureCategory,
  LectureCategoryFilter,
  LectureCategoryFilterNames,
  LectureCategoryNames,
  LectureOrderType,
  LectureOrderTypeNames,
  LectureSearchType,
  LectureSearchTypeNames,
} from '../../domain/LectureType';
import { Request } from 'express';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { validateClass } from '../../common/util/ClassValidateUtil';

export class LectureListRequest {

  @IsOptional()
  @IsPositive({ message: '페이지는 양수여야 합니다.' })
  private readonly _page: number;

  @IsOptional()
  @IsPositive({ message: '페이지 사이즈는 양수여야 합니다.' })
  private readonly _pageSize: number;

  @IsOptional()
  @IsEnum(LectureOrderType, { message: '유효하지 않은 정렬타입 입니다.' })
  private readonly _order: LectureOrderTypeNames;

  @IsOptional()
  @IsEnum(LectureCategory, { message: '유효하지 않은 카테고리 타입 입니다.' })
  private readonly _category?: LectureCategoryNames;

  @IsOptional()
  @IsEnum(LectureSearchType, { message: '유효하지 않은 검색타입 입니다.' })
  private readonly _searchType?: LectureSearchTypeNames;

  @IsOptional()
  @IsString({ message: '검색어는 문자열이어야 합니다.' })
  private readonly _searchKeyword?: string;

  constructor(
    page: number = 1,
    size: number = 10,
    order: LectureOrderTypeNames = LectureOrderType.RECENT,
    category: LectureCategoryFilterNames = LectureCategoryFilter.ALL,
    searchType?: string,
    searchKeyword?: string,
  ) {
    this._page = page;
    this._pageSize = size;
    this._order = this.toEnumCase(order) as LectureOrderTypeNames;
    this._category = this.toEnumCase(category) as LectureCategoryNames;
    this._searchType = this.toEnumCase(searchType) as LectureSearchTypeNames;
    this._searchKeyword = searchKeyword;
    validateClass(this);
  }

  public get page(): number {
    return this._page;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get order(): LectureOrderTypeNames | undefined {
    return this._order;
  }

  public get category(): LectureCategoryNames | undefined {
    return this._category;
  }

  public get searchType(): LectureSearchTypeNames | undefined {
    return this._searchType;
  }

  public get searchKeyword(): string | undefined {
    return this._searchKeyword;
  }

  public static from(request: Request): LectureListRequest {
    const { page, size, order, category, searchType, searchKeyword }: any = request.query;

    return new LectureListRequest(
      page,
      size,
      order,
      category,
      searchType,
      searchKeyword,
    );
  }

  private toEnumCase(str?: string): string | undefined {
    return str ? str.toUpperCase() : undefined;
  }
}
