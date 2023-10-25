import { type ConnectionPool } from '../config/database';
import { type PoolConnection } from 'mysql2/promise';
import containerConfig from '../config/container';
import TYPES from '../constant/bindingTypes';

export function transactional() {
  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<any> {
      const connectionPool: ConnectionPool = containerConfig.get<ConnectionPool>(TYPES.ConnectionPool);
      const connection: PoolConnection = await connectionPool.getConnection();

      try {
        await connection.beginTransaction();
        const result = await originalMethod.apply(this, [...args, connection]);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    };

    return descriptor;
  };
}
