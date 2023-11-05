import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { PoolConnection } from 'mysql2/promise';
import { MockFactory } from '../../util/MockFactory';
import { InstructorService } from '../../../main/instructor/service/InstructorService';
import { InstructorRepository } from '../../../main/instructor/repository/InstructorRepository';
import { Instructor } from '../../../main/instructor/domain/Instructor';
import { NotFoundException } from '../../../main/common/exception/NotFoundException';

describe('InstructorService', () => {

  let connection: jest.Mocked<PoolConnection>;
  let mockLectureStudentCountRepository: jest.Mocked<InstructorRepository>;
  let sut: InstructorService;

  beforeEach(() => {
    connection = MockFactory.create<PoolConnection>();
    mockLectureStudentCountRepository = MockFactory.create<InstructorRepository>();
    sut = new InstructorService(mockLectureStudentCountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateInstructorExists', () => {

    it('[Success] 강사가 존재하는 경우 예외를 던지지 않는다.', async () => {
      // given
      const instructorId: number = 1;
      mockLectureStudentCountRepository.findById.mockResolvedValueOnce(new Instructor(1, '강사'));

      // when, then
      await expect(sut.validateInstructorExists(instructorId, connection)).resolves.not.toThrow();
    });

    it('[Failure] 강사가 존재하지 않는 경우 NotFoundException을 던진다.', async () => {
      // given
      const instructorId: number = 1;
      mockLectureStudentCountRepository.findById.mockResolvedValueOnce(null);

      // when
      const actual = sut.validateInstructorExists(instructorId, connection);

      // then
      await expect(actual).rejects.toThrowError(NotFoundException);
    });
  });
});
