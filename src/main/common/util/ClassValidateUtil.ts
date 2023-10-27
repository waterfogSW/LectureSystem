import { validateSync, ValidationError } from 'class-validator';
import { IllegalArgumentException } from '../exception/IllegalArgumentException';

export function validateClass(object: object): void {
  const errors: ValidationError[] = validateSync(object);
  if (errors.length > 0) {
    const constraints: { [p: string]: string } | undefined = errors[0].constraints;
    const errorMessage: string = constraints ? Object.values(constraints)[0] : '잘못된 요청입니다.';
    throw new IllegalArgumentException(errorMessage);
  }
}
