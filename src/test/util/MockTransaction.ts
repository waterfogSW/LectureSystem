import { jest } from '@jest/globals';
import { container } from '../../main/common/config/ContainerConfig';
import { BindingTypes } from '../../main/common/constant/BindingTypes';

export function initializeMockTransactionContext() {
  jest.spyOn(container, 'get').mockImplementation((bindingType) => {
    if (bindingType === BindingTypes.ConnectionPool) {
      return {
        getConnection: jest.fn().mockImplementation(() => ({
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn(),
          })),
      };
    }
    throw new Error(`Cannot find Connection Pool: ${ bindingType.toString() }`);
  });
}
