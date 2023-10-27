import { Student } from '../domain/Student';
import { injectable } from 'inversify';
import { type FieldPacket, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';

@injectable()
export class StudentRepository {
  public async save(
    student: Student,
    connection: PoolConnection,
  ): Promise<Student> {
    const insertQuery: string = 'INSERT INTO active_students (nickname, email) VALUES (?, ?)';
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      insertQuery,
      [student.nickname, student.email],
    );

    return new Student(
      inserted.insertId,
      student.nickname,
      student.email,
      student.createdAt,
      student.updatedAt,
    );
  }

  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Student | null> {
    const selectQuery: string = 'SELECT * FROM active_students WHERE id = ?';
    const [students]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      selectQuery,
      [id],
    );
    if (students.length === 0) {
      return null;
    }
    const student: RowDataPacket = students[0];
    return new Student(
      student.id,
      student.nickname,
      student.email,
      new Date(student.created_at),
      new Date(student.updated_at),
    );
  }

  public async existsByEmail(
    email: string,
    connection: PoolConnection,
  ): Promise<boolean> {
    const existQuery: string = 'SELECT EXISTS(SELECT * FROM active_students WHERE email = ?) as exist';
    const [exist]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      existQuery,
      [email],
    );
    return exist[0].exist === 1;
  }

  public async delete(
    id: number,
    connection: PoolConnection,
  ): Promise<boolean> {
    const deleteQuery: string = 'UPDATE students SET is_deleted = 1 WHERE id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      deleteQuery,
      [id],
    );
    return deleted.affectedRows === 1;
  }
}
