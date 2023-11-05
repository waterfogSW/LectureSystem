import { injectable } from 'inversify';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Enrollment } from '../domain/Enrollment';

@injectable()
export class EnrollmentRepository {

  public async findAllByLectureId(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<Array<Enrollment>> {
    const selectQuery: string = 'SELECT * FROM enrollments WHERE lecture_id = ?';
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
    const selectQuery: string = 'SELECT * FROM enrollments WHERE lecture_id = ? AND student_id = ?';
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

    if (insertResult.affectedRows === 0) {
      throw new Error('수강신청 생성에 실패했습니다.');
    }

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
    const selectQuery: string = 'SELECT * FROM enrollments WHERE student_id = ?';
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
    const deleteQuery: string = 'DELETE FROM enrollments WHERE id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      deleteQuery,
      [id],
    );

    if (deleted.affectedRows === 0) {
      throw new Error('수강신청 삭제에 실패했습니다.');
    }
  }
}
