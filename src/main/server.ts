import { interfaces } from 'inversify';
import express, { Application } from 'express';
import { ConfigFunction } from './common/type/config-function.type';
import Container = interfaces.Container;

export class Server {
  private readonly _container: Container;
  private readonly _instance: Application;

  constructor(
    container: Container,
  ) {
    this._container = container;
    this._instance = express();
  }

  public setConfig(fn: ConfigFunction) {
    fn(this._instance);
    return this;
  }

  public build(): Application {
    return this._instance;
  }
}
