import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { StudentRepository } from '../../../main/student/repository/StudentRepository';
import { MockFactory } from '../../util/MockFactory';
import { Student } from '../../../main/student/domain/Student';

describe('StudentRepository', () => {

  let connection: jest.Mocked<PoolConnection>;
  let sut: StudentRepository;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    sut = new StudentRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {

    it('[Success] Student를 저장한다.', async () => {
      // given
      const student: Student = new Student(1, 'nickname', 'email@example.com');
      const result: [ResultSetHeader, FieldPacket[]] = [{ insertId: 1, affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const savedStudent = await sut.save(student, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'INSERT INTO students (nickname, email) VALUES (?, ?)',
        [student.nickname, student.email],
      );
      expect(savedStudent).toBeInstanceOf(Student);
      expect(savedStudent.id).toBe(result[0].insertId);
    });

    it('[Failure] Student 저장에 실패하면 예외를 던진다.', async () => {
      // given
      const student: Student = new Student(1, 'nickname', 'email@example.com');
      const result: [ResultSetHeader, FieldPacket[]] = [{ insertId: 0, affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.save(student, connection);

      // then
      await expect(action).rejects.toThrow('학생 생성에 실패했습니다.');
    });
  });

  describe('findById', () => {

    it('[Success] 주어진 ID를 가진 Student를 찾는다.', async () => {
      // given
      const student: Student = new Student(1, 'nickname', 'email@example.com');
      const data: [RowDataPacket[], FieldPacket[]] = [[{
        id: student.id,
        nickname: student.nickname,
        email: student.email,
        created_at: student.createdAt,
        updated_at: student.updatedAt,
      }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const foundStudent = await sut.findById(student.id!, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM students WHERE id = ?',
        [student.id],
      );
      expect(foundStudent).toEqual(expect.any(Student));
      expect(foundStudent?.id).toBe(student.id);
    });

    it('[Failure] ID에 해당하는 Student가 없으면 null을 반환한다.', async () => {
      // given
      const id = 999; // Non-existing ID
      const data: [RowDataPacket[], FieldPacket[]] = [[], []];
      connection.execute.mockResolvedValue(data);

      // when
      const student = await sut.findById(id, connection);

      // then
      expect(student).toBeNull();
    });
  });

  describe('existsByEmail', () => {

    it('이메일이 존재하는지 확인한다.', async () => {
      // given
      const email = 'email@example.com';
      const data: [RowDataPacket[], FieldPacket[]] = [[{ exist: 1 }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const doesExist = await sut.existsByEmail(email, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT EXISTS(SELECT * FROM students WHERE email = ?) as exist',
        [email],
      );
      expect(doesExist).toBe(true);
    });

    it('이메일이 존재하지 않으면 false를 반환한다.', async () => {
      // given
      const email = 'nonexistent@example.com';
      const data: [RowDataPacket[], FieldPacket[]] = [[{ exist: 0 }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const doesExist = await sut.existsByEmail(email, connection);

      // then
      expect(doesExist).toBe(false);
    });
  });

  describe('deleteById', () => {

    it('[Success] 주어진 ID로 Student를 삭제한다.', async () => {
      // given
      const id = 1;
      const result: [ResultSetHeader, FieldPacket[]] = [{ affectedRows: 1 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      await sut.deleteById(id, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'DELETE FROM students WHERE id = ?',
        [id],
      );
    });

    it('[Failure] 주어진 ID로 Student 삭제에 실패하면 예외를 던진다.', async () => {
      // given
      const id = 1;
      const result: [ResultSetHeader, FieldPacket[]] = [{ affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(result);

      // when
      const action = sut.deleteById(id, connection);

      // then
      await expect(action).rejects.toThrowError();
    });
  });
});
