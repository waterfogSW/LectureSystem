import { Response } from 'express';
import { jest } from '@jest/globals';

export class MockResponseFactory {

  public static create(): Response {
    const responseObject: any = {
      status: jest.fn().mockImplementation(() => responseObject),
      json: jest.fn().mockImplementation(() => responseObject),
      send: jest.fn().mockImplementation(() => responseObject),
    };

    return responseObject as Response;
  }
}
