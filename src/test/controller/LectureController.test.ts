import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureService } from '../../main/service/LectureService';
import { LectureDTOMapper } from '../../main/controller/mapper/LectureDTOMapper';
import { Lecture } from '../../main/model/Lecture';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('LectureController', () => {
  let lectureController: LectureController;
  let lectureService: jest.Mocked<LectureService>;
  let lectureDTOMapper: jest.Mocked<LectureDTOMapper>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    lectureService = MockFactory.create<LectureService>();
    lectureDTOMapper = MockFactory.create<LectureDTOMapper>();
    lectureController = new LectureController(lectureService, lectureDTOMapper);

    responseObject = {
      status: jest.fn().mockImplementation(() => responseObject),
      json: jest.fn().mockImplementation(() => responseObject),
    };
    mockRequest = {};
    mockResponse = responseObject;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('강의 생성 요청을 처리하고 생성된 강의 정보를 반환한다', async () => {
    // given
    mockRequest.body = {
      title: 'Test Lecture',
      introduction: 'This is a test lecture.',
      instructorId: 1,
      category: 'WEB',
      price: 5000,
    };

    const createdLecture = new Lecture(1, 'Test Lecture', 'This is a test lecture.', 1, 'WEB', 5000);
    lectureService.createLecture.mockResolvedValue(createdLecture);

    const lectureCreateResponse = { id: 1, title: 'Test Lecture' };
    lectureDTOMapper.toLectureCreateResponse.mockReturnValue(lectureCreateResponse);

    // when
    await lectureController.createLecture(mockRequest as Request, mockResponse as Response);

    // then
    expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
    expect(mockResponse.json).toBeCalledWith(lectureCreateResponse);
  });
});
