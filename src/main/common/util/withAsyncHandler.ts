import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type asyncRouterFunction = (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
) => Promise<void>;
export const withAsyncHandler = (targetFunction: asyncRouterFunction) => async (
  req: Request<ParamsDictionary, any, any, ParsedQs>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await targetFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};
