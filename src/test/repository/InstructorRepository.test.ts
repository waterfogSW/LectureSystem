import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { MockFactory } from '../util/MockFactory';
import { InstructorRepository } from '../../main/repository/InstructorRepository';
import { Instructor } from '../../main/domain/Instructor';


describe('InstructorRepository', () => {

  let connection: jest.Mocked<PoolConnection>;
  let sut: InstructorRepository;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    sut = new InstructorRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {

    it('[Success] 주어진 ID를 가진 Instructor를 찾는다.', async () => {
      // given
      const instructor: Instructor = new Instructor(1, 'nickname');
      const data: [RowDataPacket[], FieldPacket[]] = [[{
        id: instructor.id,
        name: instructor.name,
        created_at: instructor.createdAt,
        updated_at: instructor.updatedAt,
      }], []] as any;

      connection.execute.mockResolvedValue(data);

      // when
      const foundInstructor = await sut.findById(instructor.id!, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM active_instructors WHERE id = ?',
        [instructor.id],
      );
    });

    it('[Success] 해당하는 데이터가 없으면 null을 반환한다.', async () => {
      // given
      const instructor: Instructor = new Instructor(1, 'nickname');
      const data: [RowDataPacket[], FieldPacket[]] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const foundInstructor = await sut.findById(instructor.id!, connection);

      // then
      expect(foundInstructor).toBeNull();
    });
  });
});
