import { Student } from '../../domain/Student';

export class StudentCreateResponse {

  private readonly id: number;

  private readonly nickname: string;

  private readonly email: string;


  constructor(
    id: number,
    nickname: string,
    email: string,
  ) {
    this.id = id;
    this.nickname = nickname;
    this.email = email;
  }

  public static from(student: Student): StudentCreateResponse {
    return new StudentCreateResponse(
      student.id!,
      student.nickname,
      student.email,
    );
  }
}
