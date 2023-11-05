import { injectable } from 'inversify';
import { type FieldPacket, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { Student } from '../domain/Student';

@injectable()
export class StudentRepository {
  public async save(
    student: Student,
    connection: PoolConnection,
  ): Promise<Student> {
    const insertQuery: string = 'INSERT INTO students (nickname, email) VALUES (?, ?)';
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      insertQuery,
      [student.nickname, student.email],
    );

    if (inserted.affectedRows === 0) {
      throw new Error('학생 생성에 실패했습니다.');
    }

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
    const selectQuery: string = 'SELECT * FROM students WHERE id = ?';
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
    const existQuery: string = 'SELECT EXISTS(SELECT * FROM students WHERE email = ?) as exist';
    const [exist]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      existQuery,
      [email],
    );
    return exist[0].exist === 1;
  }

  public async deleteById(
    id: number,
    connection: PoolConnection,
  ): Promise<void> {
    const deleteQuery: string = 'DELETE FROM students WHERE id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      deleteQuery,
      [id],
    );
    if (deleted.affectedRows === 0) {
      throw new Error('수강생 삭제에 실패했습니다.');
    }
  }

  public async createDeletedStudent(
    student: Student,
    connection: PoolConnection,
  ): Promise<void> {
    const { id, email, nickname }: Student = student;
    const insertQuery: string = 'INSERT INTO deleted_students (student_id, email, nickname) VALUES (?, ?, ?)';
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      insertQuery,
      [id, email, nickname],
    );
    if (inserted.affectedRows === 0) {
      throw new Error('삭제 수강생 정보 생성에 실패했습니다.');
    }
  }
}
