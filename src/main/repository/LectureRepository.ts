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
    const query: string = `
        SELECT lectures.id,
               lectures.title,
               lectures.introduction,
               lectures.category,
               lectures.price,
               lectures.created_at,
               lectures.instructor_id
        FROM active_lectures as lectures
        ${ this._buildWhereClause(category, searchType, searchKeyword) }
        ${ this._buildOrderClause(order) }
        ${ this._buildPaginationClause(page, pageSize) }
    `;

    const [rows, field]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query);

    return rows.map((row: RowDataPacket) => {
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
    category?: LectureCategoryNames,
    searchType?: LectureSearchTypeNames,
    searchKeyword?: string,
  ): string {
    const conditions: string[] = [];
    const categoryFilterClause: string = this._buildCategoryFilterClause(category);
    if (categoryFilterClause) {
      conditions.push(categoryFilterClause);
    }

    const searchClause: string = this._buildSearchClause(searchType, searchKeyword);
    if (searchClause) {
      conditions.push(searchClause);
    }

    return conditions.length > 0 ? ` WHERE ${ conditions.join(' AND ') }` : '';
  }

  private _buildCategoryFilterClause(category?: LectureCategoryNames): string {
    if (!category) {
      return '';
    }
    return `category = '${ category }'`;
  }

  private _buildSearchClause(
    searchType?: LectureSearchTypeNames,
    searchKeyword?: string,
  ): string {
    if (!searchType || !searchKeyword) {
      return '';
    }
    const conditionMapping: { [key: string]: string } = {
      [LectureSearchType.TITLE]: `title LIKE '%${ searchKeyword }%'`,
      [LectureSearchType.INSTRUCTOR]: `instructor_id IN (SELECT id FROM active_instructors WHERE name LIKE '%${ searchKeyword }%')`,
      [LectureSearchType.STUDENT_ID]: `id IN (SELECT lecture_id FROM active_enrollments WHERE student_id = ${ searchKeyword })`,
    };
    return conditionMapping[searchType];
  }

  private _buildOrderClause(order: LectureOrderTypeNames): string {
    if (order === LectureOrderType.ENROLLMENTS) {
      return ` ORDER BY (SELECT COUNT(*) FROM enrollments WHERE enrollments.lecture_id = lectures.id) DESC`;
    }
    return ` ORDER BY created_at DESC`;
  }

  private _buildPaginationClause(
    page: number,
    pageSize: number,
  ): string {
    const offset: number = (page - 1) * pageSize;
    return ` LIMIT ${ pageSize } OFFSET ${ offset }`;
  }

}
