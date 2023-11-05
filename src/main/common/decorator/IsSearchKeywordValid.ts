import { isInt, isPositive, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { LectureSearchType } from '../../lecture/domain/LectureSearchType';

export function IsSearchKeywordValid(validationOptions?: ValidationOptions) {
  return (
    object: Record<string, any>,
    propertyName: string,
  ) => {
    registerDecorator({
      name: 'isSearchKeywordValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ) {
          const searchType: LectureSearchType = (args.object as any)._searchType as LectureSearchType;
          switch (searchType) {
            case LectureSearchType.TITLE:
            case LectureSearchType.INSTRUCTOR:
              return typeof value === 'string' && value.length >= 2;
            case LectureSearchType.STUDENT_ID:
              return isPositive(value) && isInt(value);
            default:
              return true;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const searchType: LectureSearchType = (args.object as any)._searchType as LectureSearchType;
          switch (searchType) {
            case LectureSearchType.TITLE:
            case LectureSearchType.INSTRUCTOR:
              return '검색어는 문자열이며 2글자 이상이어야 합니다.';
            case LectureSearchType.STUDENT_ID:
              return '학생 ID는 1이상인 양수여야 합니다.';
            default:
              return '검색어가 유효하지 않습니다.';
          }
        },
      },
    });
  };
}
