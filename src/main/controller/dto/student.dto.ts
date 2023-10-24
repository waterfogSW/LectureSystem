import { Student } from '../../model/student.model';

export class StudentCreateResponse {
  private readonly _id: number;
  private readonly _nickname: string;

  constructor(
    id: number,
    nickname: string,
  ) {
    this._id = id;
    this._nickname = nickname;
  }

  public static from(student: Student): StudentCreateResponse {
    if (student.id === undefined) throw Error('Student id is undefined');
    return new StudentCreateResponse(
      student.id,
      student.nickname,
    );

  }
}
