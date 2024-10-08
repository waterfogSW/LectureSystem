import {
  registerDecorator,
  validateSync,
  ValidationArguments,
  ValidationError,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IllegalArgumentException } from '../exception/IllegalArgumentException';

export function validateClass(object: object): void {
  const errors: ValidationError[] = validateSync(object);
  if (errors.length > 0) {
    const {constraints} = errors[0];
    const errorMessage: string = constraints ? Object.values(constraints)[0] : '잘못된 요청입니다.';
    throw new IllegalArgumentException(errorMessage);
  }
}

@ValidatorConstraint({ name: 'isPositiveNumberArrayValidator', async: false })
class IsPositiveNumberArrayValidator implements ValidatorConstraintInterface {
  validate(items: number[]): boolean {
    return items.every(item => item > 0);
  }

  defaultMessage(): string {
    return '배열의 모든 요소는 0보다 큰 숫자여야 합니다.';
  }
}

export function IsPositiveNumberArray(validationOptions?: ValidationOptions) {
  return (
    object: Record<string, any>,
    propertyName: string,
  ) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveNumberArrayValidator,
    });
  };
}
