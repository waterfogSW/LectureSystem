import { Student } from '../model/Student';
import { injectable } from 'inversify';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

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

}
