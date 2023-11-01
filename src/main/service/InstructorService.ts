import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { InstructorRepository } from '../repository/InstructorRepository';
import { BindingTypes } from '../common/constant/BindingTypes';
import { PoolConnection } from 'mysql2/promise';
import { Instructor } from '../domain/Instructor';
import { NotFoundException } from '../common/exception/NotFoundException';

@injectable()
export class InstructorService {

  constructor(
    @inject(BindingTypes.InstructorRepository)
    private readonly _instructorRepository: InstructorRepository,
  ) {}

  public async validateInstructorExists(
    instructorId: number,
    connection: PoolConnection,
  ): Promise<void> {
    const instructor: Instructor | null = await this._instructorRepository.findById(instructorId, connection);
    if (instructor === null) {
      throw new NotFoundException(`존재하지 않는 강사(id=${ instructorId })입니다`);
    }
  }
}
