import { describe, jest, beforeEach, it, expect, afterEach } from '@jest/globals';
import { EnrollmentRepository } from '../../main/repository/EnrollmentRepository';
import { FieldPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { MockFactory } from '../util/MockFactory';
import { Enrollment } from '../../main/domain/Enrollment';


describe('EnrollmentRepository', () => {

  let connection: jest.Mocked<PoolConnection>;
  let sut: EnrollmentRepository;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    sut = new EnrollmentRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllByLectureId', () => {

    it('[Success] LectureId를 가진 모든 Enrollment 조회를 요청한다.', async () => {
      // given
      const lectureId: number = 1;
      const data: [Array<RowDataPacket>, Array<FieldPacket>] = [[],[]]
      connection.execute.mockResolvedValue(data);

      // when
      await sut.findAllByLectureId(lectureId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM active_enrollments WHERE lecture_id = ?',
        [lectureId],
      );
    });
  });

  describe('findByLectureIdAndStudentId', () => {

    it('[Success] LectureId와 StudentId를 가진 Enrollment 조회를 요청한다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;
      const data: [Array<RowDataPacket>, Array<FieldPacket>] = [[], []];
      connection.execute.mockResolvedValue(data);

      // when
      await sut.findByLectureIdAndStudentId(lectureId, studentId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM active_enrollments WHERE lecture_id = ? AND student_id = ?',
        [lectureId, studentId],
      );
    });

    it('[Success] 해당하는 데이터가 없으면 null을 반환한다.', async () => {
      // given
      const lectureId: number = 1;
      const studentId: number = 1;
      const data: [Array<RowDataPacket>, Array<FieldPacket>] = [[], []];
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Enrollment | null = await sut.findByLectureIdAndStudentId(lectureId, studentId, connection);

      // then
      expect(actual).toBeNull();
    });
  });

  describe('save', () => {

    it('[Success] Enrollment를 저장한다.', async () => {
      // given
      const enrollment: Enrollment = new Enrollment(1, 1, 1);
      const data: [any, Array<FieldPacket>] = [{}, []];
      connection.execute.mockResolvedValue(data);

      // when
      await sut.save(enrollment, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'INSERT INTO enrollments (lecture_id, student_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [
          enrollment.lectureId,
          enrollment.studentId,
          enrollment.createdAt,
          enrollment.updatedAt,
        ],
      );
    });

    it('[Failure] Enrollment를 저장하는데 실패하면 예외를 던진다.', async () => {
      // given
      const enrollment: Enrollment = new Enrollment(1, 1, 1);
      const data: [any, Array<FieldPacket>] = [{ affectedRows: 0 }, []];
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Promise<Enrollment> = sut.save(enrollment, connection);

      // then
      await expect(actual).rejects.toThrowError(Error);
    });
  });

  describe('findAllByStudentId', () => {

    it('[Success] StudentId를 가진 모든 Enrollment 조회를 요청한다.', async () => {
      // given
      const studentId: number = 1;
      const data: [Array<RowDataPacket>, Array<FieldPacket>] = [[], []];
      connection.execute.mockResolvedValue(data);

      // when
      await sut.findAllByStudentId(studentId, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM active_enrollments WHERE student_id = ?',
        [studentId],
      );
    });
  });

  describe('deleteById', () => {

    it('[Success] Enrollment를 삭제한다.', async () => {
      // given
      const id: number = 1;
      const data: [any, Array<FieldPacket>] = [{}, []];
      connection.execute.mockResolvedValue(data);

      // when
      await sut.deleteById(id, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'UPDATE enrollments SET is_deleted = 1 WHERE id = ?',
        [id],
      );
    });

    it('[Failure] Enrollment를 삭제하는데 실패하면 예외를 던진다.', async () => {
      // given
      const id: number = 1;
      const data: [any, Array<FieldPacket>] = [{ affectedRows: 0 }, []];
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Promise<void> = sut.deleteById(id, connection);

      // then
      await expect(actual).rejects.toThrowError(Error);
    });
  });
});
