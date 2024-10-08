import { type PoolConnection } from 'mysql2/promise';
import { type ConnectionPool } from '../config/DatabaseConfig';
import { container } from '../config/ContainerConfig';
import { BindingTypes } from '../constant/BindingTypes';

export function transactional(isReadonly: boolean = false) {
  return (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<any> {
      const connectionPool: ConnectionPool = container.get<ConnectionPool>(BindingTypes.ConnectionPool);
      const connection: PoolConnection = await connectionPool.getConnection();

      if (isReadonly) {
        try {
          return await originalMethod.apply(this, [...args, connection]);
        } finally {
          connection.release();
        }
      }

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
