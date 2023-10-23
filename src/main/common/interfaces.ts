import { Application } from 'express';

export type ConfigFunction = (app: Application) => void;
