import { Request } from 'express';

export class MockRequestBuilder {

  private request: Partial<Request> = {};

  public body(data: any): MockRequestBuilder {
    this.request.body = data;
    return this;
  }

  public query(data: any): MockRequestBuilder {
    this.request.query = data;
    return this;
  }

  public params(data: any): MockRequestBuilder {
    this.request.params = data;
    return this;
  }

  public build(): Request {
    return this.request as Request;
  }
}
