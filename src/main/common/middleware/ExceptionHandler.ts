import { type NextFunction, type Request, type Response } from 'express';
import { NotFoundException } from '../exception/NotFoundException';
import { HttpStatus } from '../constant/HttpStatus';
import { IllegalArgumentException } from '../exception/IllegalArgumentException';

interface ErrorStatusMapping {
  type: any;
  status: HttpStatus;
  defaultMessage?: string;
}

export const errorStatusMappings: ErrorStatusMapping[] = [
  { type: NotFoundException, status: HttpStatus.NOT_FOUND },
  { type: IllegalArgumentException, status: HttpStatus.BAD_REQUEST },
  { type: Error, status: HttpStatus.INTERNAL_SERVER_ERROR, defaultMessage: '알 수 없는 에러' },
];

export function ExceptionHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  console.log(`[${ new Date().toISOString() }] ${ error }`);

  for (const handler of errorStatusMappings) {
    if (error instanceof handler.type) {
      const errorMessage = handler.defaultMessage || error.message;
      response.status(handler.status).json({ message: errorMessage });
      return;
    }
  }

  response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: '서버 오류' });
}
