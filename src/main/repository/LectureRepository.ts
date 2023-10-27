import { injectable } from 'inversify';
import { Lecture } from '../domain/Lecture';
import { FieldPacket, PoolConnection, ResultSetHeader } from 'mysql2/promise';

@injectable()
export class LectureRepository {

  public async save(
    lecture: Lecture,
    connection: PoolConnection,
  ): Promise<Lecture> {
    const saveQuery: string = `INSERT INTO lectures (title, introduction, instructor_id, category, price)
                               VALUES (?, ?, ?, ?, ?)`;
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      saveQuery,
      [lecture.title, lecture.introduction, lecture.instructorId, lecture.category, lecture.price],
    );

    return new Lecture(
      inserted.insertId,
      lecture.title,
      lecture.introduction,
      lecture.instructorId!,
      lecture.category,
      lecture.price,
    );
  }

}
