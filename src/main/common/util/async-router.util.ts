import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export const doAsync = (fn: (
  arg0: Request<ParamsDictionary, any, any, ParsedQs>,
  arg1: Response,
  arg2: NextFunction,
) => Promise<any>) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => await fn(req, res, next).catch(next);
