import { type NextFunction, type Request, type Response } from 'express';
import { NotFoundError } from '../error/NotFoundError';
import { HTTP_STATUS, type HttpStatus } from '../constant/httpStatus';
import { InvalidInputError } from '../error/InvalidInputError';
import { ValidationError } from 'class-validator';

interface ErrorStatusMapping {
  type: any;
  status: HttpStatus;
}

const errorStatusMappings: ErrorStatusMapping[] = [
  { type: NotFoundError, status: HTTP_STATUS.NOT_FOUND },
  { type: InvalidInputError, status: HTTP_STATUS.BAD_REQUEST },
  { type: ValidationError, status: HTTP_STATUS.BAD_REQUEST },
  { type: Error, status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
];

export function ErrorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  console.log(`[${ new Date().toISOString() }] ${ error }`);

  for (const handler of errorStatusMappings) {
    if (error instanceof handler.type) {
      response
        .status(handler.status)
        .json({ message: error.message });
      return;
    }
  }

  response
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: '서버 오류' });
}
