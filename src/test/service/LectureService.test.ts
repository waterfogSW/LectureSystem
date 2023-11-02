import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LectureStudentCountRepository } from '../../main/repository/LectureStudentCountRepository';
import { MockFactory } from '../util/MockFactory';
import { PoolConnection } from 'mysql2/promise';
import { NotFoundException } from '../../main/common/exception/NotFoundException';
import { LectureService } from '../../main/service/LectureService';
import { LectureRepository } from '../../main/repository/LectureRepository';
import { Lecture } from '../../main/domain/Lecture';
import { TestLectureFactory } from '../util/TestLectureFactory';
import { LectureListItem } from '../../main/controller/dto/LectureListResponse';
import { LectureCategory } from '../../main/domain/LectureEnums';
import { LectureListRequest } from '../../main/controller/dto/LectureListRequest';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { LecturePublishRequest } from '../../main/controller/dto/LecturePublishRequest';
import { LectureDeleteRequest } from '../../main/controller/dto/LectureDeleteRequest';

describe('LectureService', () => {

  let connection: jest.Mocked<PoolConnection>;
  let mockLectureRepository: jest.Mocked<LectureRepository>;
  let mockLectureStudentCountRepository: jest.Mocked<LectureStudentCountRepository>;
  let sut: LectureService;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    mockLectureRepository = MockFactory.create<LectureRepository>();
    mockLectureStudentCountRepository = MockFactory.create<LectureStudentCountRepository>();
    sut = new LectureService(mockLectureRepository, mockLectureStudentCountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {

    it('[Success] Id를 가진 Lecture 조회를 요청한다.', async () => {
      // given
      const id: number = 1;
      const expected: Lecture = TestLectureFactory.createWithId(id);

      mockLectureRepository.findById.mockResolvedValue(expected);

      // when
      const actual: Lecture = await sut.findById(id, connection);

      // then
      expect(actual).toEqual(expected);
    });

    it('[Failure] Id를 가진 Lecture가 존재하지 않는다면 NotFoundException을 던진다.', async () => {
      // given
      const id: number = 1;
      mockLectureRepository.findById.mockResolvedValue(null);

      // when
      const actual: Promise<Lecture> = sut.findById(id, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {

    it('[Success] Lecture의 목록조회를 요청한다.', async () => {
      // given
      const request: LectureListRequest = new LectureListRequest(1, 10);
      const expected: Array<LectureListItem> = [
        new LectureListItem(1, LectureCategory.APP, 'title1', '감자', 10000, 10000, new Date()),
        new LectureListItem(2, LectureCategory.ALGORITHM, 'title2', '고구마', 2000, 10000, new Date()),
      ];
      const expectedTotalCount: number = 2;

      mockLectureRepository.findByPage.mockResolvedValue(expected);
      mockLectureRepository.count.mockResolvedValue(expectedTotalCount);

      // when
      const actual: [Array<LectureListItem>, number] = await sut.findAll(request, connection);

      // then
      expect(actual[0]).toEqual(expected);
      expect(actual[1]).toEqual(expectedTotalCount);
    });
  });

  describe('create', () => {
    it('[Success] Lecture를 생성한다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      const expected: Lecture = TestLectureFactory.createWithId(1);

      jest.spyOn(sut, 'validateLectureTitleExists').mockResolvedValue(undefined);
      mockLectureRepository.save.mockResolvedValue(expected);

      // when
      const actual: Lecture = await sut.create(request, connection);

      // then
      expect(actual.id).toEqual(expected.id);
      expect(mockLectureStudentCountRepository.create).toBeCalled();
    });

    it('[Failure] 이미 존재하는 Lecture의 제목이라면 예외를 던진다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      const expected: Lecture = TestLectureFactory.createWithId(1);

      jest.spyOn(sut, 'validateLectureTitleExists').mockRejectedValue(new IllegalArgumentException(''));
      mockLectureRepository.save.mockResolvedValue(expected);

      // when
      const actual: Promise<Lecture> = sut.create(request, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });

    it('[Failure] Lecture를 생성하고 LectureStudentCount를 생성하는데 실패하면 예외를 던진다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      const expected: Lecture = TestLectureFactory.createWithId(1);

      jest.spyOn(sut, 'validateLectureTitleExists').mockResolvedValue(undefined);
      mockLectureRepository.save.mockResolvedValue(expected);
      mockLectureStudentCountRepository.create.mockRejectedValue(new Error());

      // when
      const actual: Promise<Lecture> = sut.create(request, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('[Success] Lecture를 수정한다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      const targetLecture: Lecture = TestLectureFactory.createWithId(1);

      jest.spyOn(sut, 'validateLectureTitleExists').mockResolvedValue(undefined);
      mockLectureRepository.findById.mockResolvedValue(targetLecture);

      // when
      await sut.update(request, connection);

      // then
      expect(mockLectureRepository.update).toBeCalled();
    });

    it('[Failure] 해당 id값의 lecture가 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      mockLectureRepository.findById.mockRejectedValue(new NotFoundException(''));

      // when
      const actual: Promise<void> = sut.update(request, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });

    it('[Failure] 이미 존재하는 Lecture의 제목이라면 예외를 던진다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();
      jest.spyOn(sut, 'validateLectureTitleExists').mockRejectedValue(new IllegalArgumentException(''));

      // when
      const actual: Promise<void> = sut.update(request, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });

    it('[Failure] Lecture를 수정하는데 실패하면 예외를 던진다.', async () => {
      // given
      const request = TestLectureDataFactory.createData();

      jest.spyOn(sut, 'validateLectureTitleExists').mockResolvedValue(undefined);
      mockLectureRepository.update.mockRejectedValue(new Error());

      // when
      const actual: Promise<void> = sut.update(request, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('getLectureStudentCount', () => {
    it('[Success] Lecture의 학생수를 조회한다.', async () => {
      // given
      const lectureId: number = 1;
      const expected: number = 1;

      mockLectureStudentCountRepository.getStudentCount.mockResolvedValue(expected);

      // when
      const actual: number = await sut.getLectureStudentCount(lectureId, connection);

      // then
      expect(actual).toEqual(expected);
    });
  });

  describe('validateAllLecturesPublished', () => {
    it('[Success] 모든 Lecture가 published 상태라면 예외를 던지지 않는다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const expected: Array<Lecture> = [
        TestLectureFactory.createWithId(1).publish(),
        TestLectureFactory.createWithId(2).publish(),
        TestLectureFactory.createWithId(3).publish(),
      ];

      mockLectureRepository.findById.mockResolvedValueOnce(expected[0]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[1]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[2]);

      // when
      const actual: Promise<void> = sut.validateAllLecturesPublished(lectureIds, connection);

      // then
      await expect(actual).resolves.not.toThrowError();
    });

    it('[Failure] 하나라도 published 상태가 아니라면 예외를 던진다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const expected: Array<Lecture> = [
        TestLectureFactory.createWithId(1).publish(),
        TestLectureFactory.createWithId(2).publish(),
        TestLectureFactory.createWithId(3),
      ];

      mockLectureRepository.findById.mockResolvedValueOnce(expected[0]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[1]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[2]);

      // when
      const actual: Promise<void> = sut.validateAllLecturesPublished(lectureIds, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('findAllByIds', () => {
    it('[Success] Id값들에 해당하는 모든 Lecture를 조회한다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const expected: Array<Lecture> = [
        TestLectureFactory.createWithId(1),
        TestLectureFactory.createWithId(2),
        TestLectureFactory.createWithId(3),
      ];

      mockLectureRepository.findById.mockResolvedValueOnce(expected[0]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[1]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[2]);

      // when
      const actual: Array<Lecture> = await sut.findAllByIds(lectureIds, connection);

      // then
      expect(actual).toEqual(expected);
    });

    it('[Failure] Id값들에 해당하는 Lecture가 하나라도 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const expected: Array<Lecture> = [
        TestLectureFactory.createWithId(1),
        TestLectureFactory.createWithId(2),
        TestLectureFactory.createWithId(3),
      ];

      mockLectureRepository.findById.mockResolvedValueOnce(expected[0]);
      mockLectureRepository.findById.mockResolvedValueOnce(expected[1]);
      mockLectureRepository.findById.mockResolvedValueOnce(null);

      // when
      const actual: Promise<Array<Lecture>> = sut.findAllByIds(lectureIds, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('validateLectureExists', () => {
    it('[Success] Lecture가 존재하면 예외를 던지지 않는다.', async () => {
      // given
      const lectureId: number = 1;
      const expected: Lecture = TestLectureFactory.createWithId(lectureId);

      mockLectureRepository.findById.mockResolvedValue(expected);

      // when
      const actual: Promise<void> = sut.validateLectureExists(lectureId, connection);

      // then
      await expect(actual).resolves.not.toThrowError();
    });

    it('[Failure] Lecture가 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      mockLectureRepository.findById.mockResolvedValue(null);

      // when
      const actual: Promise<void> = sut.validateLectureExists(lectureId, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('validateLectureTitleExists', () => {

    it('[Success] 해당 제목의 Lecture가 존재하지 않으면 예외를 던지지 않는다.', async () => {
      // given
      const title: string = 'title';
      mockLectureRepository.findByTitle.mockResolvedValue(null);

      // when
      const actual: Promise<void> = sut.validateLectureTitleExists(title, connection);

      // then
      await expect(actual).resolves.not.toThrowError();
    });

    it('[Failure] 해당 제목의 Lecture가 존재하면 예외를 던진다.', async () => {
      // given
      const title: string = 'title';
      const expected: Lecture = TestLectureFactory.createWithId(1);

      mockLectureRepository.findByTitle.mockResolvedValue(expected);

      // when
      const actual: Promise<void> = sut.validateLectureTitleExists(title, connection);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('[Success] Lecture를 삭제한다.', async () => {
      // given
      const lectureId: number = 1;
      const request: LectureDeleteRequest = new LectureDeleteRequest(lectureId);
      const expected: Lecture = TestLectureFactory.createWithId(lectureId);

      mockLectureRepository.findById.mockResolvedValue(expected);

      // when
      await sut.delete(request, connection);

      // then
      expect(mockLectureRepository.delete).toBeCalled();
      expect(mockLectureStudentCountRepository.delete).toBeCalled();
    });

    it('[Failure] 해당 id값의 lecture가 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const request: LectureDeleteRequest = new LectureDeleteRequest(lectureId);
      mockLectureRepository.findById.mockRejectedValue(new NotFoundException(''));

      // when
      const actual: Promise<void> = sut.delete(request, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });
  });

  describe('publish', () => {
    it('[Success] Lecture를 published 상태로 변경한다.', async () => {
      // given
      const lectureId: number = 1;
      const request: LecturePublishRequest = new LecturePublishRequest(lectureId);
      const expected: Lecture = TestLectureFactory.createWithId(lectureId);

      mockLectureRepository.findById.mockResolvedValue(expected);

      // when
      await sut.publish(request, connection);

      // then
      expect(mockLectureRepository.update).toBeCalled();
    });

    it('[Failure] 해당 id값의 lecture가 존재하지 않으면 예외를 던진다.', async () => {
      // given
      const lectureId: number = 1;
      const request: LecturePublishRequest = new LecturePublishRequest(lectureId);
      mockLectureRepository.findById.mockRejectedValue(new NotFoundException(''));

      // when
      const actual: Promise<void> = sut.publish(request, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });
  });

  describe('validateNoDuplicateLectureIds', () => {
    it('[Success] 중복되는 LectureId가 없으면 예외를 던지지 않는다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const studentId: number = 1;

      // when
      const actual: Promise<void> = sut.validateNoDuplicateLectureIds(lectureIds);

      // then
      await expect(actual).resolves.not.toThrowError();
    });

    it('[Failure] 중복되는 LectureId가 있으면 예외를 던진다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3, 3];
      const studentId: number = 1;

      // when
      const actual: Promise<void> = sut.validateNoDuplicateLectureIds(lectureIds);

      // then
      await expect(actual).rejects.toThrowError();
    });
  });

});
