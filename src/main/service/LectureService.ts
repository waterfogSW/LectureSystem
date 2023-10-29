import { inject, injectable } from 'inversify';
import { LectureRepository } from '../repository/LectureRepository';
import { BindingTypes } from '../common/constant/BindingTypes';
import { Lecture } from '../domain/Lecture';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/Transactional';
import { InstructorRepository } from '../repository/InstructorRepository';
import { Instructor } from '../domain/Instructor';
import { NotFoundException } from '../common/exception/NotFoundException';
import { LectureCreateRequest } from '../controller/dto/LectureCreateRequest';
import { LectureCreateResponse } from '../controller/dto/LectureCreateResponse';
import { LectureListRequest } from '../controller/dto/LectureListRequest';
import { LectureListItem, LectureListResponse } from '../controller/dto/LectureListResponse';
import { LectureStudentCountRepository } from '../repository/LectureStudentCountRepository';


@injectable()
export class LectureService {

  constructor(
    @inject(BindingTypes.LectureRepository) private readonly _lectureRepository: LectureRepository,
    @inject(BindingTypes.LectureStudentCountRepository) private readonly _lectureStudentCountRepository: LectureStudentCountRepository,
    @inject(BindingTypes.InstructorRepository) private readonly _instructorRepository: InstructorRepository,
  ) {}

  @transactional()
  public async createLecture(
    request: LectureCreateRequest,
    connection?: PoolConnection,
  ): Promise<LectureCreateResponse> {
    const { title, introduction, instructorId, category, price }: LectureCreateRequest = request;
    const instructor: Instructor | null = await this._instructorRepository.findById(instructorId, connection!);
    if (instructor === null) {
      throw new NotFoundException(`존재하지 않는 강사 ID(${ instructorId }) 입니다`);
    }

    const lecture: Lecture = Lecture.create(title, introduction, instructor.id!, category, price);
    const createdLecture: Lecture = await this._lectureRepository.save(lecture, connection!);
    await this._lectureStudentCountRepository.create(createdLecture.id!, connection!);

    return LectureCreateResponse.from(createdLecture);
  }

  @transactional()
  public async listLecture(
    lectureListRequest: LectureListRequest,
    connection?: PoolConnection,
  ): Promise<LectureListResponse> {
    const { page, pageSize, order, category, searchType, searchKeyword }: LectureListRequest = lectureListRequest;
    const [lectureListItems, lectureCount]: [Array<LectureListItem>, number] = await Promise.all([
      this._lectureRepository.findByPage(
        connection!,
        page,
        pageSize,
        order,
        category,
        searchType,
        searchKeyword,
      ),
      this._lectureRepository.count(
        connection!,
        category,
        searchType,
        searchKeyword,
      ),
    ]) as [Array<LectureListItem>, number];

    return LectureListResponse.of(lectureListItems, page, pageSize, lectureCount);
  }
}
