import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureService } from '../../main/service/LectureService';
import { Lecture } from '../../main/domain/Lecture';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { TestLectureFactory } from '../util/TestLectureFactory';
import exp from 'constants';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';
import { create } from 'domain';

describe('LectureController', () => {

  let lectureService: jest.Mocked<LectureService>;
  let lectureController: LectureController;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    lectureService = MockFactory.create<LectureService>();
    lectureController = new LectureController(lectureService);

    responseObject = {
      status: jest.fn().mockImplementation(() => responseObject),
      json: jest.fn().mockImplementation(() => responseObject),
    };
    mockRequest = {};
    mockResponse = responseObject;
  });

  describe('createLecture', () => {

    it('강의 생성 요청을 처리한다.', async () => {
      // given
      mockRequest.body = TestLectureDataFactory.createData();
      const savedLecture: Lecture = TestLectureFactory.createWithId(1);
      const lectureCreateResponse: LectureCreateResponse = LectureCreateResponse.from(savedLecture);
      lectureService.createLecture.mockResolvedValue(lectureCreateResponse);

      // when
      await lectureController.createLecture(mockRequest as Request, mockResponse as Response);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toBeCalledWith(lectureCreateResponse);
    });

    it('강의 생성 요청 시 유효하지 않은 카테고리가 들어오면 예외를 던진다', async () => {
      // given
      mockRequest.body = TestLectureDataFactory.createDataWithCategory('INVALID_CATEGORY');

      // when, then
      await expect(lectureController.createLecture(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrowError(IllegalArgumentException);
    });
  });
});
