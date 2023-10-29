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

@injectable()
export class LectureRepository {

  private static readonly START_PAGE: number = 1;

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

  public async findByPage(
    connection: PoolConnection,
    page: number,
    pageSize: number,
    order: LectureOrderTypeNames,
    category?: LectureCategoryNames,
    searchType?: LectureSearchTypeNames,
    searchKeyword?: string,
  ): Promise<Array<Lecture>> {
    const queryParams: (string | number)[] = [];
    const query: string = `
        SELECT lectures.id,
               lectures.title,
               lectures.introduction,
               lectures.category,
               lectures.price,
               lectures.created_at,
               lectures.instructor_id
        FROM active_lectures as lectures
            ${ this._buildWhereClause(queryParams, category, searchType, searchKeyword) } 
            ${ this._buildOrderClause(order) }
            ${ this._buildPaginationClause(queryParams, page, pageSize) }
    `;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query, queryParams);

    return rows.map((row: RowDataPacket): Lecture => {
      return new Lecture(
        row.id,
        row.title,
        row.introduction,
        row.instructor_id,
        row.category,
        row.price,
        row.created_at,
        row.updated_at,
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

    return conditions.length > 0 ? ` WHERE ${ conditions.join(' AND ') }` : '';
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
          return ' title LIKE ?';
        case LectureSearchType.INSTRUCTOR:
          queryParams.push(`%${ searchKeyword }%`);
          return ' instructor_id IN (SELECT id FROM active_instructors WHERE name LIKE ?)';
        case LectureSearchType.STUDENT_ID:
          queryParams.push(searchKeyword);
          return ' id IN (SELECT lecture_id FROM active_enrollments WHERE student_id = ?)';
      }
    }
    return '';
  }

  private _buildOrderClause(order: LectureOrderTypeNames): string {
    if (order === LectureOrderType.ENROLLMENTS) {
      return ' ORDER BY (SELECT COUNT(*) FROM active_enrollments WHERE active_enrollments.lecture_id = lectures.id) DESC';
    }
    return ' ORDER BY created_at DESC';
  }

  private _buildPaginationClause(
    queryParams: (string | number)[],
    page: number,
    pageSize: number,
  ): string {
    const offset: number = (page - LectureRepository.START_PAGE) * pageSize;
    queryParams.push(pageSize.toString());
    queryParams.push(offset.toString());
    return ' LIMIT ? OFFSET ?';
  }

}
