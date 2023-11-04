import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Lecture } from '../../main/domain/Lecture';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { FieldPacket, PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { MockFactory } from '../util/MockFactory';
import { TestLectureFactory } from '../util/TestLectureFactory';
import { LectureSearchType } from '../../main/domain/LectureEnums';


describe('LectureRepository', () => {

  let connection: jest.Mocked<PoolConnection>;
  let sut: LectureRepository;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    sut = new LectureRepository();
  });

  describe('findById', () => {
    it('[Success] id 값에 해당하는 Lecture를 조회한다', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[{
        id: lecture.id,
        title: lecture.title,
        introduction: lecture.introduction,
        instructor_id: lecture.instructorId,
        category: lecture.category,
        price: lecture.price,
        created_at: lecture.createdAt,
        updated_at: lecture.updatedAt,
        is_published: lecture.isPublished,
      }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.findById(lecture.id!, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM lectures WHERE id = ?',
        [lecture.id],
      );
    });

    it('[Success] Lecture를 찾지 못했을 때, null을 반환한다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const foundLecture: Lecture | null = await sut.findById(lecture.id!, connection);

      // then
      expect(foundLecture).toBeNull();
    });
  });

  describe('findByTitle', () => {

    it('[Success] title에 해당하는 Lecture를 조회한다', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[{
        id: lecture.id,
        title: lecture.title,
        introduction: lecture.introduction,
        instructor_id: lecture.instructorId,
        category: lecture.category,
        price: lecture.price,
        created_at: lecture.createdAt,
        updated_at: lecture.updatedAt,
        is_published: lecture.isPublished,
      }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.findByTitle(lecture.title!, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'SELECT * FROM lectures WHERE title = ?',
        [lecture.title],
      );
    });

    it('[Success] Lecture를 찾지 못했을 때, null을 반환한다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const foundLecture: Lecture | null = await sut.findByTitle(lecture.title!, connection);

      // then
      expect(foundLecture).toBeNull();
    });
  });

  describe('save', () => {

    it('[Success] Lecture를 저장한다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.save(lecture, connection);

      // then
      const expectedQuery: string = `INSERT INTO lectures (title, introduction, instructor_id, category, price, created_at, updated_at, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`.replace(/\s+/g, ' ').trim();
      const receivedQuery: string = connection.execute.mock.calls[0][0].toString().replace(/\s+/g, ' ').trim();
      expect(receivedQuery).toEqual(expectedQuery);
      expect(connection.execute).toBeCalledWith(
        expect.any(String),
        [
          lecture.title,
          lecture.introduction,
          lecture.instructorId,
          lecture.category,
          lecture.price,
          lecture.createdAt,
          lecture.updatedAt,
          lecture.isPublished,
        ],
      );
    });

    it('[Failure] Lecture를 저장하는데 실패하면 예외를 던진다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [ResultSetHeader, Array<FieldPacket>] = [{ affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Promise<Lecture> = sut.save(lecture, connection);

      // then
      await expect(actual).rejects.toThrowError(Error);
    });
  });

  describe('update', () => {

    it('[Success] Lecture를 수정한다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [any, any] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.update(lecture, connection);

      // then
      const expectedQuery: string = `UPDATE lectures SET title = ?, introduction = ?, instructor_id = ?, category = ?, price = ?, is_published = ?, updated_at = ? WHERE id = ?`.replace(/\s+/g, ' ').trim();
      const receivedQuery: string = connection.execute.mock.calls[0][0].toString().replace(/\s+/g, ' ').trim();

      expect(receivedQuery).toEqual(expectedQuery);
      expect(connection.execute).toBeCalledWith(
        expect.any(String),
        [
          lecture.title,
          lecture.introduction,
          lecture.instructorId,
          lecture.category,
          lecture.price,
          lecture.isPublished,
          lecture.updatedAt,
          lecture.id,
        ],
      );
    });

    it('[Failure] Lecture를 수정하는데 실패하면 예외를 던진다.', async () => {
      // given
      const lecture: Lecture = TestLectureFactory.createWithId(1);

      const data: [ResultSetHeader, Array<FieldPacket>] = [{ affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Promise<void> = sut.update(lecture, connection);

      // then
      await expect(actual).rejects.toThrowError(Error);
    });
  });

  describe('count', () => {
    it.each(Object.values(LectureSearchType))('[Success] Lecture의 개수를 검색한다. (카테고리 = 없음, 검색타입 = %s)', async (searchType: LectureSearchType) => {
      // given
      const searchKeyword: string = 'keyword';
      const data: [any, any] = [[{ count: 1 }], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.count(connection, undefined, searchType, searchKeyword);

      // then
      const expectedSearchWhereClauseMapping: { [key in LectureSearchType]: string } = {
        [LectureSearchType.TITLE]: 'MATCH(title) AGAINST(+? IN BOOLEAN MODE)',
        [LectureSearchType.INSTRUCTOR]: 'MATCH(instructors.name) AGAINST(+? IN BOOLEAN MODE)',
        [LectureSearchType.STUDENT_ID]: 'lectures.id IN (SELECT enrollments.lecture_id FROM enrollments WHERE enrollments.student_id = ?)',
      };

      const expectedSearchQueryParamsMapping: { [key in LectureSearchType]: (string | number)[] } = {
        [LectureSearchType.TITLE]: [1, `%${ searchKeyword }%`],
        [LectureSearchType.INSTRUCTOR]: [1, `%${ searchKeyword }%`],
        [LectureSearchType.STUDENT_ID]: [1, searchKeyword],
      };

      const expectedQuery: string =
        `
        SELECT COUNT(lectures.id) as count FROM lectures
        JOIN instructors ON lectures.instructor_id = instructors.id
        JOIN lecture_student_counts as counts ON lectures.id = counts.lecture_id
        WHERE is_published = ? AND ${ expectedSearchWhereClauseMapping[searchType] }
        `.replace(/\s+/g, ' ').trim();

      const receivedQuery: string =
        connection.execute.mock.calls[0][0].toString().replace(/\s+/g, ' ').trim();

      expect(receivedQuery).toEqual(expectedQuery);
      expect(connection.execute).toBeCalledWith(expect.any(String), expectedSearchQueryParamsMapping[searchType]);
    });
  });

  describe('delete', () => {

    it('[Success] Lecture를 삭제한다.', async () => {
      // given
      const id: number = 1;

      const data: [any, any] = [[], []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      await sut.delete(id, connection);

      // then
      expect(connection.execute).toBeCalledWith(
        'DELETE FROM lectures WHERE id = ?',
        [id],
      );
    });

    it('[Failure] Lecture를 삭제하는데 실패하면 예외를 던진다.', async () => {
      // given
      const id: number = 1;

      const data: [ResultSetHeader, FieldPacket[]] = [{ affectedRows: 0 }, []] as any;
      connection.execute.mockResolvedValue(data);

      // when
      const actual: Promise<void> = sut.delete(id, connection);

      // then
      await expect(actual).rejects.toThrowError(Error);
    });
  });
});
