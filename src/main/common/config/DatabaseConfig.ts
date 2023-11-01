import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { injectable } from 'inversify';

const connectionPoolConfig = {
  host: 'db',
  port: 3306,
  database: 'lecture_system',
  user: 'root',
  password: 'root',
  timezone: '+09:00', // 한국 시간
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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
