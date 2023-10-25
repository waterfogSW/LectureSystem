import { NextFunction, Request, Response } from 'express';
import { NotfoundError } from '../error/not-found.error';
import { HttpStatus } from '../constant/http-status.constant';
import { InvalidInputError } from '../error/invalid-input.error';
import { ValidationError } from 'class-validator';

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
    handleInvalidInputError((error: any) => {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }),
    handleValidationError((error: any) => {
      response
        .status(HttpStatus.BAD_REQUEST)
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

const handleInvalidInputError = (handler: (error: any) => void) => (error: any): void => {
  if (error instanceof InvalidInputError) {
    handler(error);
  }
};

const handleValidationError = (handler: (error: any) => void) => (error: any): void => {
  if (error instanceof ValidationError) {
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
