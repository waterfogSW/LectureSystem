import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { EnrollmentController } from '../../../main/enrollment/controller/EnrollmentController';
import { EnrollmentFacade } from '../../../main/enrollment/facade/EnrollmentFacade';
import { MockFactory } from '../../util/MockFactory';
import { MockRequestBuilder } from '../../util/MockRequestBuilder';
import { MockResponseFactory } from '../../util/MockResponseFactory';
import { HttpStatus } from '../../../main/common/constant/HttpStatus';
import { IllegalArgumentException } from '../../../main/common/exception/IllegalArgumentException';

describe('EnrollmentController', () => {

  let mockEnrollmentFacade: jest.Mocked<EnrollmentFacade>;
  let sut: EnrollmentController;

  beforeEach(() => {
    mockEnrollmentFacade = MockFactory.create<EnrollmentFacade>();
    sut = new EnrollmentController(mockEnrollmentFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEnrollment', () => {
    it('[Success] 강의 수강 신청을 요청한다.', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const studentId: number = 1;
      const data = { lectureIds, studentId };

      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.createEnrollment(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.CREATED);
    });

    it('[Failure] studentId가 0보다 작으면 예외를 던진다', async () => {
      // given
      const lectureIds: Array<number> = [1, 2, 3];
      const studentId: number = -1;
      const data = { lectureIds, studentId };

      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createEnrollment(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] lectureIds 의 요소가 0보다 작으면 예외를 던진다', async () => {
      // given
      const lectureIds: Array<number> = [-1];
      const studentId: number = 1;
      const data = { lectureIds, studentId };

      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createEnrollment(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] lectureIds 의 요소가 1개 미만이면 예외를 던진다', async () => {
      // given
      const lectureIds: Array<number> = [];
      const studentId: number = 1;
      const data = { lectureIds, studentId };

      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createEnrollment(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] lectureIds 가 배열이 아니면 예외를 던진다', async () => {
      // given
      const lectureIds = '123';
      const studentId: number = 1;
      const data = { lectureIds, studentId };

      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createEnrollment(request, response)).rejects.toThrowError(IllegalArgumentException);
    });
  });
});
