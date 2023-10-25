import { injectable } from 'inversify';
import { type Student } from '../model/Student';
import { type StudentCreateResponse } from '../controller/dto/StudentCreateResponse';

@injectable()
export class StudentDTOMapper {
  public toStudentCreateResponse(student: Student): StudentCreateResponse {
    return {
      id: student.id!,
      nickname: student.nickname,
      email: student.email,
    };
  }
}
