import { inject, injectable } from 'inversify';
import { LectureRepository } from '../repository/LectureRepository';
import { BindingTypes } from '../common/constant/BindingTypes';
import { Lecture } from '../model/Lecture';
import { LectureCategoryNames } from '../model/LectureCategory';
import { PoolConnection } from 'mysql2/promise';
import { transactional } from '../common/decorator/transactional';


@injectable()
export class LectureService {

  constructor(
    @inject(BindingTypes.LectureRepository) private readonly _lectureRepository: LectureRepository,
  ) {}

  @transactional()
  public async createLecture(
    title: string,
    introduction: string,
    instructorId: number,
    category: LectureCategoryNames,
    price: number,
    connection?: PoolConnection,
  ): Promise<Lecture> {
    const lecture: Lecture = Lecture.create(
      title,
      introduction,
      instructorId,
      category,
      price,
    );

    return await this._lectureRepository.save(lecture, connection!);
  }

}
