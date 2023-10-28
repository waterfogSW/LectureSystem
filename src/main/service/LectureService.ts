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


@injectable()
export class LectureService {

  constructor(
    @inject(BindingTypes.LectureRepository) private readonly _lectureRepository: LectureRepository,
    @inject(BindingTypes.InstructorRepository) private readonly _instructorRepository: InstructorRepository,
  ) {}

  @transactional()
  public async createLecture(
    request: LectureCreateRequest,
    connection?: PoolConnection,
  ): Promise<Lecture> {
    const { title, introduction, instructorId, category, price }: LectureCreateRequest = request;
    const instructor: Instructor | null = await this._instructorRepository.findById(instructorId, connection!);
    if (instructor === null) {
      throw new NotFoundException(`존재하지 않는 강사 ID(${ instructorId }) 입니다`);
    }

    const lecture: Lecture = Lecture.create(title, introduction, instructor.id!, category, price);
    return await this._lectureRepository.save(lecture, connection!);
  }

}
