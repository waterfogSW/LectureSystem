import { interfaces } from 'inversify';
import express, { Application } from 'express';
import Container = interfaces.Container;

type ConfigFunction = (app: Application) => void;

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
