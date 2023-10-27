import 'reflect-metadata';
import { StudentController } from '../../main/controller/StudentController';
import { StudentService } from '../../main/service/StudentService';
import { StudentDTOMapper } from '../../main/controller/mapper/StudentDTOMapper';
import { Student } from '../../main/domain/Student';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService: jest.Mocked<StudentService>;
  let studentDTOMapper: jest.Mocked<StudentDTOMapper>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    studentService = MockFactory.create<StudentService>();
    studentDTOMapper = MockFactory.create<StudentDTOMapper>();
    studentController = new StudentController(studentService, studentDTOMapper);

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
      const studentInfo = {
        nickname: 'test',
        email: 'test@student.com',
      };
      mockRequest.body = studentInfo;

      const createdStudent = new Student(1, studentInfo.nickname, studentInfo.email);
      studentService.createStudent.mockResolvedValue(createdStudent);

      const studentCreateResponse = { id: 1, nickname: 'test_student', email: 'test@student.com' };
      studentDTOMapper.toStudentCreateResponse.mockReturnValue(studentCreateResponse);

      // when
      await studentController.createStudent(mockRequest as Request, mockResponse as Response);

      // then
      expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toBeCalledWith(studentCreateResponse);
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
