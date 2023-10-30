import { injectable } from 'inversify';
import { Lecture } from '../domain/Lecture';
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {
  LectureCategoryNames,
  LectureOrderType,
  LectureOrderTypeNames,
  LectureSearchType,
  LectureSearchTypeNames,
} from '../domain/LectureType';
import { LectureListItem } from '../controller/dto/LectureListResponse';

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
    );
  }

  public async save(
    lecture: Lecture,
    connection: PoolConnection,
  ): Promise<Lecture> {
    const saveQuery: string = `INSERT INTO lectures (title, introduction, instructor_id, category, price)
                               VALUES (?, ?, ?, ?, ?)`;
    const [inserted]: [ResultSetHeader, FieldPacket[]] = await connection.execute<ResultSetHeader>(
      saveQuery,
      [lecture.title, lecture.introduction, lecture.instructorId, lecture.category, lecture.price],
    );

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
    await connection.execute(
      updateQuery,
      [lecture.title, lecture.introduction, lecture.instructorId, lecture.category, lecture.price, lecture.is_published, lecture.updatedAt, lecture.id],
    );
  }

  public async count(
    connection: PoolConnection,
    category?: LectureCategoryNames,
    searchType?: LectureSearchTypeNames,
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

  public async findByPage(
    connection: PoolConnection,
    page: number,
    pageSize: number,
    order: LectureOrderTypeNames,
    category?: LectureCategoryNames,
    searchType?: LectureSearchTypeNames,
    searchKeyword?: string,
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
    category?: LectureCategoryNames,
    searchType?: LectureSearchTypeNames,
    searchKeyword?: string,
  ): string {
    const conditions: string[] = [];

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

  private _buildWhereCategoryClause(
    queryParams: (string | number)[],
    category?: LectureCategoryNames,
  ): string {
    if (category) {
      queryParams.push(category);
      return ' category = ?';
    }
    return '';
  }

  private _buildWhereSearchClause(
    queryParams: (string | number)[],
    searchType?: LectureSearchTypeNames,
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

  private _buildOrderClause(order: LectureOrderTypeNames): string {
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
