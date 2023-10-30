import { injectable } from 'inversify';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';

@injectable()
export class LectureStudentCountRepository {

  public async create(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const insertQuery: string = 'INSERT INTO lecture_student_counts (lecture_id, count) VALUES (?, 0)';
    await connection.execute(insertQuery, [lectureId]);
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
  ):Promise<void> {
    const deleteQuery: string = 'UPDATE lecture_student_counts SET is_deleted = 1 WHERE lecture_id = ?';
    await poolConnection.execute(deleteQuery, [lectureId]);
  }
}
