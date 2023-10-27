import { injectable } from 'inversify';
import { type Student } from '../../domain/Student';
import { type StudentCreateResponse } from '../dto/StudentCreateResponse';
import { StudentCreateRequest } from '../dto/StudentCreateRequest';
import { Request } from 'express';

@injectable()
export class StudentDTOMapper {
  public toStudentCreateResponse(student: Student): StudentCreateResponse {
    return {
      id: student.id!,
      nickname: student.nickname,
      email: student.email,
    };
  }

  public toStudentCreateRequest(request: Request): StudentCreateRequest {
    const { nickname, email } = request.body;
    return new StudentCreateRequest(nickname, email);
  }
}
