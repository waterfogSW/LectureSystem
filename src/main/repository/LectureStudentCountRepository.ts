import { injectable } from 'inversify';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

@injectable()
export class LectureStudentCountRepository {

  public async create(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const insertQuery: string = 'INSERT INTO lecture_student_counts (lecture_id, count) VALUES (?, 0)';
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      insertQuery,
      [lectureId],
    );
    if (inserted.affectedRows === 0) {
      throw new Error('수강생 수 정보 생성에 실패했습니다.');
    }
  }

  public async increment(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const updateQuery: string = 'UPDATE lecture_student_counts SET count = count + 1 WHERE lecture_id = ?';
    const [updated]: [ResultSetHeader, FieldPacket[]] = await connection.execute(updateQuery, [lectureId]);
    if (updated.affectedRows === 0) {
      throw new Error('수강생 수 변경에 실패했습니다.');
    }
  }

  public async decrement(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const updateQuery: string = 'UPDATE active_lecture_student_counts SET count = count - 1 WHERE lecture_id = ?';
    const [updated]: [ResultSetHeader, FieldPacket[]] = await connection.execute(updateQuery, [lectureId]);
    if (updated.affectedRows === 0) {
      throw new Error('수강생 수 변경에 실패했습니다.');
    }
  }

  public async getStudentCount(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<number> {
    const selectQuery: string = 'SELECT count FROM active_lecture_student_counts WHERE lecture_id = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(selectQuery, [lectureId]);
    return rows[0].count;
  }

  public async delete(
    lectureId: number,
    poolConnection: PoolConnection,
  ): Promise<void> {
    const deleteQuery: string = 'UPDATE lecture_student_counts SET is_deleted = 1 WHERE lecture_id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await poolConnection.execute<ResultSetHeader>(
      deleteQuery,
      [lectureId],
    );
    if (deleted.affectedRows === 0) {
      throw new Error('수강생 수 정보 삭제에 실패했습니다.');
    }
  }
}
