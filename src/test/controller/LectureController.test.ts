import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureService } from '../../main/service/LectureService';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { MockRequestFactory } from '../util/MockRequestFactory';
import { MockResponseFactory } from '../util/MockResponseFactory';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';

describe('LectureController', () => {

  let mockLectureService: jest.Mocked<LectureService>;
  let sut: LectureController;

  beforeEach(() => {
    mockLectureService = MockFactory.create<LectureService>();
    sut = new LectureController(mockLectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecture', () => {

    it('[Good] 새로운 강의를 생성한다.', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(data), MockResponseFactory.create()];

      const response : LectureCreateResponse = new LectureCreateResponse(1, data.title);
      mockLectureService.createLecture.mockResolvedValue(response);

      // when
      await sut.createLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toBeCalledWith(response);
    });

    it('[Bad] 유효하지 않은 카테고리가 들어오면 예외를 던진다', async () => {
      // given
      const data = TestLectureDataFactory.createDataWithCategory('INVALID_CATEGORY');
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.createLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });
  });
});
