import { Request } from 'express';

export class MockRequestFactory {

  public static createWithBody(data: any): Request {
    return {
      body: data,
    } as Request;
  }

  public static createWithQuery(data: any): Request {
    return {
      query: data,
    } as Request;
  }

  public static createWithParams(data: any): Request {
    return {
      params: data,
    } as Request;
  }
}
