import 'reflect-metadata';
import { StudentController } from '../../main/controller/StudentController';
import { StudentFacade } from '../../main/facade/StudentFacade';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HttpStatus } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestStudentDataFactory } from '../util/TestStudentDataFactory';
import { StudentCreateResponse } from '../../main/controller/dto/StudentCreateResponse';
import { MockRequestBuilder } from '../util/MockRequestBuilder';
import { MockResponseFactory } from '../util/MockResponseFactory';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';

describe('StudentController', () => {

  let mockStudentFacade: jest.Mocked<StudentFacade>;
  let sut: StudentController;

  beforeEach(() => {
    mockStudentFacade = MockFactory.create<StudentFacade>();
    sut = new StudentController(mockStudentFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('[Success] 학생 생성을 요청한다', async () => {
      // given
      const data = TestStudentDataFactory.createData();
      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      const responseData: StudentCreateResponse = new StudentCreateResponse(1, data.nickname, data.email);
      mockStudentFacade.createStudent.mockResolvedValueOnce(responseData);

      // when
      await sut.createStudent(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.CREATED);
      expect(response.json).toBeCalledWith(responseData);
    });
  });

  describe('deleteStudent', () => {
    it('[Success] 학생 삭제를 요청한다', async () => {
      // given
      const id = 1;
      const request: Request = new MockRequestBuilder().params({ id }).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.deleteStudent(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 학생 id가 숫자가 아닌 경우 예외를 던진다', async () => {
      // given
      const id = 'a';
      const request: Request = new MockRequestBuilder().params({ id }).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.deleteStudent(request, response)).rejects.toThrow(IllegalArgumentException);
    });

    it('[Failure] 학생 id가 1보다 작은 경우 예외를 던진다', async () => {
      // given
      const id = 0;
      const request: Request = new MockRequestBuilder().params({ id }).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.deleteStudent(request, response)).rejects.toThrow(IllegalArgumentException);
    });
  });

});
