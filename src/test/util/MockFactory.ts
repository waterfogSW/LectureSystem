// MockFactory.ts
import { jest } from '@jest/globals';

export class MockFactory {
  public static create<T extends object>(): jest.Mocked<T> {
    const handler: ProxyHandler<any> = {
      get: (target: any, prop: string | symbol) => {
        if (!(prop in target)) {
          target[prop] = jest.fn();
        }
        return target[prop];
      },
    };

    return new Proxy({}, handler) as jest.Mocked<T>;
  }
}
