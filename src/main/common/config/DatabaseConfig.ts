import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { injectable } from 'inversify';

const connectionPoolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  timezone: process.env.DB_TIMEZONE || '+00:00',
  waitForConnections: Boolean(process.env.DB_WAIT_FOR_CONNECTIONS) || true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  maxIdle: Number(process.env.DB_MAX_IDLE) || 10,
  idleTimeout: Number(process.env.DB_IDLE_TIMEOUT) || 60000,
  queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: Boolean(process.env.DB_KEEPALIVE) || true,
  keepAliveInitialDelay: Number(process.env.DB_KEEPALIVE_INITIAL_DELAY) || 0,
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
