import { injectable } from 'inversify';
import { PoolConnection } from 'mysql2/promise';

@injectable()
export class LectureStudentCountRepository {

  public async create(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const insertQuery: string = 'INSERT INTO lecture_student_counts (lecture_id, count) VALUES (?, 0)';
    await connection.execute(insertQuery, [lectureId]);
  }

}
