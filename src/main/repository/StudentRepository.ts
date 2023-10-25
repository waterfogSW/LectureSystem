import { Student } from '../model/Student';
import { injectable } from 'inversify';
import { type FieldPacket, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';

@injectable()
export class StudentRepository {
  public async save(
    student: Student,
    connection: PoolConnection,
  ): Promise<Student> {
    const insertQuery = 'INSERT INTO active_students (nickname, email) VALUES (?, ?)';
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      insertQuery,
      [student.nickname, student.email],
    );

    return new Student(
      student.nickname,
      student.email,
      inserted.insertId,
    );
  }

  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Student | null> {
    const selectQuery = 'SELECT * FROM active_students WHERE id = ?';
    const [students]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      selectQuery,
      [id],
    );
    if (students.length === 0) {
      return null;
    }
    const student: RowDataPacket = students[0];
    return new Student(
      student.nickname,
      student.email,
      student.id,
    );
  }

  public async existsByEmail(
    email: string,
    connection: PoolConnection,
  ): Promise<boolean> {
    const existQuery = 'SELECT EXISTS(SELECT * FROM active_students WHERE email = ?) as exist';
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
    const deleteQuery = 'UPDATE students SET is_deleted = 1 WHERE id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      deleteQuery,
      [id],
    );
    return deleted.affectedRows === 1;
  }
}
