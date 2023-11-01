import { IllegalArgumentException } from '../exception/IllegalArgumentException';

export function parseEnum<T extends Record<string, string>>(
  value: string,
  enumType: T,
): T[keyof T] {
  const enumValues: string[] = Object.values(enumType);

  if (enumValues.includes(value)) {
    return value as T[keyof T];
  } else {
    throw new IllegalArgumentException(`"${ value }"는 유효한 값이 아닙니다.`);
  }
}
