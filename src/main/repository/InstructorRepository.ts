import { injectable } from 'inversify';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { Instructor } from '../domain/Instructor';


@injectable()
export class InstructorRepository {

  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Instructor | null> {
    const selectQuery: string = 'SELECT * FROM active_instructors WHERE id = ?';
    const [instructors]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      selectQuery,
      [id],
    );
    if (instructors.length === 0) {
      return null;
    }
    const instructor: RowDataPacket = instructors[0];
    return new Instructor(
      instructor.id,
      instructor.name,
    );
  }
}
