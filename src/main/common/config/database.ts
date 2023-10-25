import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { injectable } from 'inversify';

const connectionPoolConfig = {
  host: 'localhost',
  port: 3306,
  database: 'lecture_system',
  user: 'root',
  password: 'root',
};

@injectable()
export class ConnectionPool {
  private readonly _pool: Pool;

  constructor() {
    this._pool = createPool(connectionPoolConfig);
  }

  public async getConnection(): Promise<PoolConnection> {
    return await this._pool.getConnection();
  }
}
