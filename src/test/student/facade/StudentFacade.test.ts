import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EnrollmentService } from '../../../main/enrollment/service/EnrollementSerivce';
import { StudentService } from '../../../main/student/service/StudentService';
import { initializeMockTransactionContext } from '../../util/MockTransaction';
import { MockFactory } from '../../util/MockFactory';
import { TestStudentFactory } from '../../util/TestStudentFactory';
import { StudentCreateRequest } from '../../../main/student/controller/dto/StudentCreateRequest';
import { TestStudentDataFactory } from '../../util/TestStudentDataFactory';
import { Student } from '../../../main/student/domain/Student';
import { StudentFacade } from '../../../main/student/facade/StudentFacade';
import { StudentCreateResponse } from '../../../main/student/controller/dto/StudentCreateResponse';
import { StudentDeleteRequest } from '../../../main/student/controller/dto/StudentDeleteRequest';

describe('StudentFacade', () => {

  let mockEnrollmentService: jest.Mocked<EnrollmentService>;
  let mockStudentService: jest.Mocked<StudentService>;
  let sut: StudentFacade;

  beforeEach(() => {
    initializeMockTransactionContext();
    mockEnrollmentService = MockFactory.create<EnrollmentService>();
    mockStudentService = MockFactory.create<StudentService>();
    sut = new StudentFacade(mockEnrollmentService, mockStudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('[Success] 학생 생성을 요청하고 응답을 반환한다.', async () => {
      // given
      const request: StudentCreateRequest = TestStudentDataFactory.createData();

      const student: Student = TestStudentFactory.createWithId(1);
      mockStudentService.create.mockResolvedValueOnce(student);

      // when
      const response: StudentCreateResponse = await sut.createStudent(request);

      // then
      const id = Reflect.get(response, 'id');
      expect(id).toBe(student.id);
    });
  });

  describe('deleteStudent', () => {
    it('[Success] 학생 삭제와 해당 학생의 수강신청 정보 삭제를 요청한다.', async () => {
      // given
      const request: StudentDeleteRequest = new StudentDeleteRequest(1);

      // when
      await sut.deleteStudent(request);

      // then
      expect(mockEnrollmentService.deleteAllByStudentId).toHaveBeenCalled();
      expect(mockStudentService.deleteById).toHaveBeenCalled();
    });

  });
});
