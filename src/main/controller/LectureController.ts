import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { LectureService } from '../service/LectureService';
import { LectureDTOMapper } from '../mapper/LectureDTOMapper';

@injectable()
export class LectureController {

  constructor(
    @inject(BindingTypes.LectureService) private readonly _lectureService: LectureService,
    @inject(BindingTypes.LectureDTOMapper) private readonly _lectureDTOMapper: LectureDTOMapper,
  ) {

  }

}
