import { inject, injectable } from 'inversify';
import { LectureRepository } from '../repository/LectureRepository';
import { BindingTypes } from '../common/constant/BindingTypes';


@injectable()
export class LectureService {

  constructor(
    @inject(BindingTypes.LectureRepository) private readonly _lectureRepository: LectureRepository,
  ) {}

}
