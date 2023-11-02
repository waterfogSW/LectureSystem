import { injectable } from 'inversify';
import { Enrollment } from '../domain/Enrollment';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

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

  public async findByLectureIdAndStudentId(
    lectureId: number,
    studentId: number,
    connection: PoolConnection,
  ): Promise<Enrollment | null> {
    const selectQuery: string = 'SELECT * FROM active_enrollments WHERE lecture_id = ? AND student_id = ?';
    const [enrollments]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      selectQuery,
      [lectureId, studentId],
    );
    if (enrollments.length === 0) {
      return null;
    }
    const enrollment: RowDataPacket = enrollments[0];
    return new Enrollment(
      enrollment.id,
      enrollment.lecture_id,
      enrollment.student_id,
      enrollment.created_at,
      enrollment.updated_at,
    );
  }

  public async save(
    newEnrollment: Enrollment,
    poolConnection: PoolConnection,
  ): Promise<Enrollment> {
    const insertQuery: string = 'INSERT INTO enrollments (lecture_id, student_id, created_at, updated_at) VALUES (?, ?, ?, ?)';
    const [insertResult]: [any, FieldPacket[]] = await poolConnection.execute(
      insertQuery,
      [
        newEnrollment.lectureId,
        newEnrollment.studentId,
        newEnrollment.createdAt,
        newEnrollment.updatedAt,
      ],
    );

    return new Enrollment(
      insertResult.insertId,
      newEnrollment.lectureId,
      newEnrollment.studentId,
      newEnrollment.createdAt,
      newEnrollment.updatedAt,
    );
  }

  async findAllByStudentId(
    studentId: number,
    connection: PoolConnection,
  ): Promise<Array<Enrollment>> {
    const selectQuery: string = 'SELECT * FROM active_enrollments WHERE student_id = ?';
    const [enrollments]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      selectQuery,
      [studentId],
    );
    return enrollments.map((enrollment: RowDataPacket) => new Enrollment(
      enrollment.id,
      enrollment.lecture_id,
      enrollment.student_id,
      enrollment.created_at,
      enrollment.updated_at,
    ));
  }

  public async deleteById(
    id: number,
    connection: PoolConnection,
  ): Promise<void> {
    const deleteQuery: string = 'UPDATE enrollments SET is_deleted = 1 WHERE id = ?'
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      deleteQuery,
      [id],
    );
  }
}
