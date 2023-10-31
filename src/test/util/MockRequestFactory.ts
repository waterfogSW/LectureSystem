
import { Request } from "express";
export class MockRequestFactory {

  public static createWithBody(data: any): Request {
    return {
      body: data
    } as Request;
  }
}
