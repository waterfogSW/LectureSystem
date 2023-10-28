import 'reflect-metadata';
import { StudentController } from '../../main/controller/StudentController';
import { StudentService } from '../../main/service/StudentService';
import { Student } from '../../main/domain/Student';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestStudentDataFactory } from '../util/TestStudentDataFactory';
import { TestStudentFactory } from '../util/TestStudentFactory';

describe('StudentController', () => {

  let studentController: StudentController;
  let studentService: jest.Mocked<StudentService>;

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    studentService = MockFactory.create<StudentService>();
    studentController = new StudentController(studentService);

    responseObject = {
      status: jest.fn().mockImplementation(() => responseObject),
      json: jest.fn().mockImplementation(() => responseObject),
      send: jest.fn().mockImplementation(() => responseObject),
    };
    mockRequest = {};
    mockResponse = responseObject;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createStudent', () => {
    it('학생 생성 요청을 처리한다', async () => {
      // given
      mockRequest.body = TestStudentDataFactory.createData();
      const createdId: number = 1;
      const createdStudent: Student = TestStudentFactory.createWithId(createdId);
      studentService.createStudent.mockResolvedValue(createdStudent);

      // when
      await studentController.createStudent(mockRequest as Request, mockResponse as Response);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
    });
  });

  describe('deleteStudent', () => {
    it('학생 삭제 요청을 처리한다.', async () => {
      // given
      const studentId = '1';
      mockRequest.params = { id: studentId };

      // when
      await studentController.deleteStudent(mockRequest as Request, mockResponse as Response);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.OK);
    });
  });
});
