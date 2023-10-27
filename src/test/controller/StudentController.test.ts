import 'reflect-metadata';
import { StudentController } from '../../main/controller/StudentController';
import { StudentService } from '../../main/service/StudentService';
import { StudentDTOMapper } from '../../main/controller/mapper/StudentDTOMapper';
import { Student } from '../../main/model/Student';
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
      send: jest.fn().mockImplementation(() => responseObject), // 'send' 메서드도 모방합니다.
    };
    mockRequest = {};
    mockResponse = responseObject;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('학생 생성 요청을 처리하고 생성된 학생 정보를 반환한다', async () => {
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

  it('학생 삭제 요청을 처리하고 성공 메시지를 반환한다', async () => {
    // given
    const studentId = '1'; // URL 파라미터에서 올 것으로 예상되는 문자열
    mockRequest.params = { id: studentId };

    // 서비스 메서드가 성공적으로 수행되었음을 나타내기 위해 특별한 값을 반환할 필요는 없습니다.
    studentService.deleteStudent.mockResolvedValue();

    // when
    await studentController.deleteStudent(mockRequest as Request, mockResponse as Response);

    // then
    expect(studentService.deleteStudent).toBeCalledWith(parseInt(studentId, 10));
    expect(mockResponse.status).toBeCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.send).toBeCalled(); // 별도의 성공 메시지 없이 응답이 전송되었는지 확인합니다.
  });
});
