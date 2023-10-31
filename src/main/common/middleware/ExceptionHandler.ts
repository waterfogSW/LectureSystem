import { type NextFunction, type Request, type Response } from 'express';
import { NotFoundException } from '../exception/NotFoundException';
import { HttpStatus } from '../constant/HttpStatus';
import { IllegalArgumentException } from '../exception/IllegalArgumentException';

interface ErrorStatusMapping {
  type: any;
  status: HttpStatus;
}

const errorStatusMappings: ErrorStatusMapping[] = [
  { type: NotFoundException, status: HttpStatus.NOT_FOUND },
  { type: IllegalArgumentException, status: HttpStatus.BAD_REQUEST },
  { type: Error, status: HttpStatus.INTERNAL_SERVER_ERROR },
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
      response
        .status(handler.status)
        .json({ message: error.message });
      return;
    }
  }

  response
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: '서버 오류' });
}
