import 'reflect-metadata';

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { MockFactory } from '../../util/MockFactory';
import { LectureStudentCountRepository } from '../../../main/lecture/repository/LectureStudentCountRepository';


describe('LectureStudentCountRepository', () => {

  let connection: jest.Mocked<PoolConnection>;
  let sut: LectureStudentCountRepository;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    sut = new LectureStudentCountRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {

    it('[Success] LectureStudentCount를 생성한다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 1, affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.create(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'INSERT INTO lecture_student_counts (lecture_id, count) VALUES (?, 0)',
        [lectureId],
      );
    });

    it('[Failure] LectureStudentCount 생성에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 0, affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.create(lectureId, connection);

      // then
      await expect(action).rejects.toThrow('수강생 수 정보 생성에 실패했습니다.');
    });
  });

  describe('increment', () => {

    it('[Success] LectureStudentCount를 1 증가시킨다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 1, affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.increment(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'UPDATE lecture_student_counts SET count = count + 1 WHERE lecture_id = ?',
        [lectureId],
      );
    });

    it('[Failure] LectureStudentCount 증가에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 0, affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.increment(lectureId, connection);

      // then
      await expect(action).rejects.toThrow('수강생 수 변경에 실패했습니다.');
    });
  });

  describe('decrement', () => {

    it('[Success] LectureStudentCount를 1 감소시킨다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 1, affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.decrement(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'UPDATE lecture_student_counts SET count = count - 1 WHERE lecture_id = ?',
        [lectureId],
      );
    });

    it('[Failure] LectureStudentCount 감소에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 0, affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.decrement(lectureId, connection);

      // then
      await expect(action).rejects.toThrow('수강생 수 변경에 실패했습니다.');
    });
  });

  describe('getStudentCount', () => {

    it('[Success] LectureStudentCount를 조회한다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [[{ count: 1 }], []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.getStudentCount(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT count FROM lecture_student_counts WHERE lecture_id = ?',
        [lectureId],
      );
    });
  });

  describe('delete', () => {

    it('[Success] LectureStudentCount를 삭제한다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 1, affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.delete(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'DELETE FROM lecture_student_counts WHERE lecture_id = ?',
        [lectureId],
      );
    });

    it('[Failure] LectureStudentCount 삭제에 실패하면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const result: [RowDataPacket[], FieldPacket[]] = [{ insertId: 0, affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.delete(lectureId, connection);

      // then
      await expect(action).rejects.toThrow('수강생 수 정보 삭제에 실패했습니다.');
    });
  });

});
