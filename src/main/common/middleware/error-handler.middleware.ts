import { NextFunction, Request, Response } from 'express';
import { NotfoundError } from '../error/notfound.error';
import { HttpStatus } from '../constant/http-status.constant';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  pipeErrorHandlers(
    handleNotFoundError((error: any) => {
      response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }),
    handleError((error: any) => {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }),
  )(error);
}

const handleNotFoundError = (handler: (error: any) => void) => (error: any): void => {
  if (error instanceof NotfoundError) {
    handler(error);
  }
};

const handleError = (handler: (error: any) => void) => (error: any): void => {
  if (error instanceof Error) {
    handler(error);
  }
};

const pipeErrorHandlers = (...handlers: ((error: any) => void)[]) => (error: any): void => {
  for (const handler of handlers) {
    handler(error);
  }
};
