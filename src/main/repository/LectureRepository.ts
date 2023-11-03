import { injectable } from 'inversify';
import { Lecture } from '../domain/Lecture';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { LectureCategory, LectureOrderType, LectureSearchType } from '../domain/LectureEnums';
import { LectureListItem } from '../controller/dto/LectureListResponse';
import { LectureListRequest } from '../controller/dto/LectureListRequest';

@injectable()
export class LectureRepository {

  private static readonly START_PAGE: number = 1;

  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Lecture | null> {
    const selectQuery: string = 'SELECT * FROM active_lectures WHERE id = ?';
    const [lectures]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      selectQuery,
      [id],
    );
    if (lectures.length === 0) {
      return null;
    }
    const lecture: RowDataPacket = lectures[0];
    return new Lecture(
      lecture.id,
      lecture.title,
      lecture.introduction,
      lecture.instructor_id,
      lecture.category,
      lecture.price,
      new Date(lecture.created_at),
      new Date(lecture.updated_at),
      Boolean(lecture.is_published),
    );
  }

  public async findByTitle(
    title: string,
    connection: PoolConnection,
  ): Promise<Lecture | null> {
    const selectQuery: string = 'SELECT * FROM active_lectures WHERE title = ?';
    const [lectures]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(
      selectQuery,
      [title],
    );
    if (lectures.length === 0) {
      return null;
    }
    const lecture: RowDataPacket = lectures[0];
    return new Lecture(
      lecture.id,
      lecture.title,
      lecture.introduction,
      lecture.instructor_id,
      lecture.category,
      lecture.price,
      new Date(lecture.created_at),
      new Date(lecture.updated_at),
      Boolean(lecture.is_published),
    );
  }

  public async save(
    lecture: Lecture,
    connection: PoolConnection,
  ): Promise<Lecture> {
    const saveQuery: string = `INSERT INTO lectures (title, introduction, instructor_id, category, price, created_at,
                                                     updated_at, is_published)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      saveQuery,
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

    if (inserted.affectedRows === 0) {
      throw new Error('강의 생성에 실패했습니다.');
    }


    return new Lecture(
      inserted.insertId,
      lecture.title,
      lecture.introduction,
      lecture.instructorId!,
      lecture.category,
      lecture.price,
      lecture.createdAt,
      lecture.updatedAt,
    );
  }

  public async update(
    lecture: Lecture,
    connection: PoolConnection,
  ): Promise<void> {
    const updateQuery: string = `UPDATE lectures
                                 SET title         = ?,
                                     introduction  = ?,
                                     instructor_id = ?,
                                     category      = ?,
                                     price         = ?,
                                     is_published  = ?,
                                     updated_at    = ?
                                 WHERE id = ?`;
    const [updated]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      updateQuery,
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

    if (updated.affectedRows === 0) {
      throw new Error('강의 업데이트에 실패했습니다.');
    }
  }

  public async count(
    connection: PoolConnection,
    category?: LectureCategory,
    searchType?: LectureSearchType,
    searchKeyword?: string,
  ): Promise<number> {
    const queryParams: (string | number)[] = [];
    const query: string = `
        SELECT COUNT(lectures.id) as count
        FROM active_lectures as lectures
                 JOIN active_instructors as instructors ON lectures.instructor_id = instructors.id
                 JOIN lecture_student_counts as counts ON lectures.id = counts.lecture_id
            ${ this._buildWhereClause(queryParams, category, searchType, searchKeyword) }
    `;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query, queryParams);
    return rows[0].count;
  }

  public async delete(
    lectureId: number,
    poolConnection: PoolConnection,
  ): Promise<void> {
    const deleteQuery: string = 'UPDATE lectures SET is_deleted = true WHERE id = ?';
    const [deleted]: [ResultSetHeader, FieldPacket[]] = await poolConnection.execute<ResultSetHeader>(
      deleteQuery,
      [lectureId],
    );

    if (deleted.affectedRows === 0) {
      throw new Error('강의 삭제에 실패했습니다.');
    }
  }

  public async findByPage(
    { page, pageSize, order, category, searchType, searchKeyword }: LectureListRequest,
    connection: PoolConnection,
  ): Promise<Array<LectureListItem>> {
    const queryParams: (string | number)[] = [];
    const query: string = `
        SELECT lectures.id         as id,
               lectures.category   as category,
               lectures.title      as title,
               instructors.name    as instructor_name,
               lectures.price      as price,
               counts.count        as student_count,
               lectures.created_at as created_at
        FROM active_lectures as lectures
                 JOIN active_instructors as instructors ON lectures.instructor_id = instructors.id
                 JOIN lecture_student_counts as counts ON lectures.id = counts.lecture_id
            ${ this._buildWhereClause(queryParams, category, searchType, searchKeyword) } ${ this._buildOrderClause(order) }
            ${ this._buildPaginationClause(queryParams, page, pageSize) }
    `;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query, queryParams);
    return rows.map((row: RowDataPacket) => {
      return LectureListItem.of(
        row.id,
        row.category,
        row.title,
        row.instructor_name,
        row.price,
        row.student_count,
        row.created_at,
      );
    });
  }

  private _buildWhereClause(
    queryParams: (string | number)[],
    category?: LectureCategory,
    searchType?: LectureSearchType,
    searchKeyword?: string,
  ): string {
    const conditions: string[] = [];

    const publishedWhereClause: string = this._buildWherePublishedClause(queryParams);
    if (publishedWhereClause) {
      conditions.push(publishedWhereClause);
    }

    const categoryWhereClause: string = this._buildWhereCategoryClause(queryParams, category);
    if (categoryWhereClause) {
      conditions.push(categoryWhereClause);
    }

    const searchWhereClause: string = this._buildWhereSearchClause(queryParams, searchType, searchKeyword);
    if (searchWhereClause) {
      conditions.push(searchWhereClause);
    }

    return conditions.length > 0 ? `WHERE ${ conditions.join(' AND ') }` : '';
  }

  private _buildWherePublishedClause(
    queryParams: (string | number)[],
    isPublished: boolean = true,
  ): string {
    if (isPublished !== undefined) {
      queryParams.push(isPublished ? 1 : 0);
      return 'is_published = ?';
    }
    return '';
  }

  private _buildWhereCategoryClause(
    queryParams: (string | number)[],
    category?: LectureCategory,
  ): string {
    if (category) {
      queryParams.push(category);
      return 'category = ?';
    }
    return '';
  }

  private _buildWhereSearchClause(
    queryParams: (string | number)[],
    searchType?: LectureSearchType,
    searchKeyword?: string,
  ): string {
    if (searchType && searchKeyword) {
      switch (searchType) {
        case LectureSearchType.TITLE:
          queryParams.push(`%${ searchKeyword }%`);
          return 'title LIKE ?';
        case LectureSearchType.INSTRUCTOR:
          queryParams.push(`%${ searchKeyword }%`);
          return 'name LIKE ?';
        case LectureSearchType.STUDENT_ID:
          queryParams.push(searchKeyword);
          return 'lectures.id IN (SELECT enrollments.lecture_id FROM active_enrollments as enrollments WHERE enrollments.student_id = ?)';
      }
    }
    return '';
  }

  private _buildOrderClause(order: LectureOrderType): string {
    if (order === LectureOrderType.ENROLLMENTS) {
      return 'ORDER BY student_count DESC';
    }
    return 'ORDER BY created_at DESC';
  }

  private _buildPaginationClause(
    queryParams: (string | number)[],
    page: number,
    pageSize: number,
  ): string {
    const offset: number = (page - LectureRepository.START_PAGE) * pageSize;
    queryParams.push(pageSize.toString());
    queryParams.push(offset.toString());
    return 'LIMIT ? OFFSET ?';
  }
}
