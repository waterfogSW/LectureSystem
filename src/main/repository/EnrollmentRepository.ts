import { injectable } from 'inversify';
import { Enrollment } from '../domain/Enrollment';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';

@injectable()
export class EnrollmentRepository {

  public async findAllByLectureId(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<Array<Enrollment>> {
    const selectQuery: string = 'SELECT * FROM active_enrollments WHERE lecture_id = ?';
    const [enrollments]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      selectQuery,
      [lectureId],
    );
    return enrollments.map((enrollment: RowDataPacket) => new Enrollment(
      enrollment.id,
      enrollment.lecture_id,
      enrollment.student_id,
      enrollment.created_at,
      enrollment.updated_at,
    ));
  }
}
