import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { BindingTypes } from '../common/constant/BindingTypes';
import { PoolConnection } from 'mysql2/promise';
import { Lecture } from '../domain/Lecture';
import { NotFoundException } from '../common/exception/NotFoundException';
import { Id } from '../common/entity/BaseEntity';
import { LectureStudentCountRepository } from '../repository/LectureStudentCountRepository';
import { LectureRepository } from '../repository/LectureRepository';
import { LectureCreateRequest } from '../controller/dto/LectureCreateRequest';
import { IllegalArgumentException } from '../common/exception/IllegalArgumentException';
import { LectureListRequest } from '../controller/dto/LectureListRequest';
import { LectureListItem } from '../controller/dto/LectureListResponse';
import { LectureUpdateRequest } from '../controller/dto/LectureUpdateRequest';
import { LectureDeleteRequest } from '../controller/dto/LectureDeleteRequest';
import { LecturePublishRequest } from '../controller/dto/LecturePublishRequest';

@injectable()
export class LectureService {
  constructor(
    @inject(BindingTypes.LectureRepository)
    private readonly _lectureRepository: LectureRepository,
    @inject(BindingTypes.LectureStudentCountRepository)
    private readonly _lectureStudentCountRepository: LectureStudentCountRepository,
  ) {}


  public async findById(
    id: number,
    connection: PoolConnection,
  ): Promise<Lecture> {
    const lecture: Lecture | null = await this._lectureRepository.findById(id, connection);
    if (lecture === null) {
      throw new NotFoundException(`존재하지 않는 강의(id=${ id })입니다`);
    }
    return lecture;
  }

  public async findAll(
    request: LectureListRequest,
    connection: PoolConnection,
  ): Promise<[Array<LectureListItem>, number]> {
    const { category, searchType, searchKeyword }: LectureListRequest = request;
    return await Promise.all([
      this._lectureRepository.findByPage(request, connection),
      this._lectureRepository.count(connection, category, searchType, searchKeyword),
    ]);
  }

  public async create(
    { title, introduction, instructorId, category, price }: LectureCreateRequest,
    connection: PoolConnection,
  ): Promise<Lecture> {
    await this.validateLectureTitleExists(title, connection!);
    const lecture: Lecture = Lecture.create(title, introduction, instructorId, category, price);

    const savedLecture: Lecture = await this._lectureRepository.save(lecture, connection);
    await this._lectureStudentCountRepository.create(savedLecture.id!, connection);
    return savedLecture;
  }

  public async update(
    request: LectureUpdateRequest,
    connection: PoolConnection,
  ): Promise<void> {
    const { lectureId, title, introduction, price }: LectureUpdateRequest = request;
    const lecture: Lecture = await this.findById(lectureId, connection!);

    if (title) {
      await this.validateLectureTitleExists(title, connection!);
    }

    const updatedLecture: Lecture = lecture.update(title, introduction, price);
    await this._lectureRepository.update(updatedLecture, connection!);
  }

  public async getLectureStudentCount(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<number> {
    return await this._lectureStudentCountRepository.getStudentCount(lectureId, connection);
  }

  public async validateAllLecturesPublished(
    lectureIds: Array<number>,
    connection: PoolConnection,
  ): Promise<void> {
    const lectures: Array<Lecture> = await this.findAllByIds(lectureIds, connection);
    const unpublishedLectures: Array<Lecture> = lectures.filter((lecture: Lecture) => !lecture.isPublished);
    if (unpublishedLectures.length > 0) {
      throw new IllegalArgumentException(`존재하지 않는 강의(id=${ unpublishedLectures.map((lecture: Lecture) => lecture.id).join(',') })가 포함되어 있습니다.`);
    }
  }

  public async findAllByIds(
    lectureIds: Array<number>,
    connection: PoolConnection,
  ): Promise<Array<Lecture>> {
    const lectures: Array<Lecture | null> = await Promise.all(
      lectureIds.map((lectureId: number) => this._lectureRepository.findById(lectureId, connection)),
    );
    const foundLectures: Array<Lecture> = lectures.filter((lecture: Lecture | null): lecture is Lecture => lecture !== null);
    if (foundLectures.length !== lectureIds.length) {
      throw new NotFoundException(`존재하지 않는 강의(id=${ lectureIds.filter((lectureId: number) => !foundLectures.some((lecture: Lecture) => lecture.id === lectureId)).join(',') })가 포함되어 있습니다.`);
    }
    return foundLectures;
  }

  public async validateLectureExists(
    lectureId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const lecture: Lecture | null = await this._lectureRepository.findById(lectureId, connection);
    if (lecture === null) {
      throw new NotFoundException(`존재하지 않는 강의(id=${ lectureId })입니다`);
    }
  }

  public async validateLectureTitleExists(
    title: string,
    connection: PoolConnection,
  ): Promise<void> {
    const lecture: Lecture | null = await this._lectureRepository.findByTitle(title, connection);
    if (lecture !== null) {
      throw new IllegalArgumentException(`이미 존재하는 강의 제목(${ title }) 입니다`);
    }
  }

  public async delete(
    request: LectureDeleteRequest,
    connection: PoolConnection,
  ): Promise<void> {
    const { lectureId }: LectureDeleteRequest = request;
    await this.validateLectureExists(lectureId, connection);
    await Promise.all([
      this._lectureRepository.delete(lectureId, connection!),
      this._lectureStudentCountRepository.delete(lectureId, connection!),
    ]);
  }

  public async publish(
    request: LecturePublishRequest,
    connection: PoolConnection,
  ): Promise<void> {
    const { lectureId }: LecturePublishRequest = request;
    const lecture: Lecture = await this.findById(lectureId, connection!);
    const publishedLecture: Lecture = lecture.publish();
    await this._lectureRepository.update(publishedLecture, connection!);
  }

  public async validateNoDuplicateLectureIds(
    lectureIds: Array<number>,
  ): Promise<void> {
    const set: Set<Id> = new Set(lectureIds);
    if (set.size !== lectureIds.length) {
      throw new IllegalArgumentException('중복된 강의가 포함되어 있습니다.');
    }
  }
}
