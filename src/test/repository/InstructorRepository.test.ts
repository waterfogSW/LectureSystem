import 'reflect-metadata';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { InstructorRepository } from '../../main/repository/InstructorRepository';
import { Instructor } from '../../main/domain/Instructor';


describe('InstructorRepository', () => {
  let instructorRepository: InstructorRepository;
  let mockConnection: any;

  beforeEach(() => {
    instructorRepository = new InstructorRepository();
    mockConnection = { execute: jest.fn() };
  });

  describe('findById', () => {

    it('ID값에 해당하는 강사가 없다면 null을 반환한다.', async () => {
      // given
      mockConnection.execute.mockResolvedValue([[], []]);

      // when
      const instructor: Instructor | null = await instructorRepository.findById(1, mockConnection);

      // then
      expect(instructor).toBeNull();
    });

    it('ID값에 해당하는 강사를 반환한다', async () => {
      // given
      const findId = 1;
      const mockInstructorData = [
        { id: findId, name: 'Test Instructor', created_at: '2021-08-01 00:00:00', updated_at: '2021-08-01 00:00:00' },
      ];
      mockConnection.execute.mockResolvedValue([mockInstructorData, []]);

      // when
      const instructor: Instructor | null = await instructorRepository.findById(findId, mockConnection);

      // then
      expect(instructor?.id!!).toBe(findId);
    });
  });
});
