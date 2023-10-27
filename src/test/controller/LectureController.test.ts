import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureService } from '../../main/service/LectureService';
import { LectureDTOMapper } from '../../main/controller/mapper/LectureDTOMapper';
import { Lecture } from '../../main/domain/Lecture';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';

describe('LectureController', () => {
  let lectureController: LectureController;
  let lectureDTOMapper: LectureDTOMapper;

  let lectureService: jest.Mocked<LectureService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    lectureService = MockFactory.create<LectureService>();
    lectureDTOMapper = new LectureDTOMapper();
    lectureController = new LectureController(lectureService, lectureDTOMapper);

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
      const title: string = 'Test Lecture';
      const introduction: string = 'This is a test lecture.';
      const instructorId: number = 1;
      const category: string = 'WEB';
      const price: number = 5000;
      mockRequest.body = { title, introduction, instructorId, category, price };

      const createdLecture: Lecture = new Lecture(1, title, introduction, instructorId, category, price);
      lectureService.createLecture.mockResolvedValue(createdLecture);

      // when
      await lectureController.createLecture(mockRequest as Request, mockResponse as Response);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toBeCalledWith({
        id: 1,
        title: 'Test Lecture',
      });
    });

    it('강의 생성 요청 시 유효하지 않은 카테고리가 들어오면 예외를 던진다', async () => {
      // given
      const title: string = 'Test Lecture';
      const introduction: string = 'This is a test lecture.';
      const instructorId: number = 1;
      const category: string = 'UNKNOWN';
      const price: number = 5000;

      mockRequest.body = { title, introduction, instructorId, category, price };

      // when, then
      await expect(lectureController.createLecture(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrowError(IllegalArgumentException);
    });
  });
});
