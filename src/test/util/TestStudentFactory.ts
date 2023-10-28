import { TestStudentDataFactory } from './TestStudentDataFactory';

export class TestStudentFactory {

  private static readonly TEST_STUDENT_DATA = TestStudentDataFactory.createData();

  public static createWithId(id: number): any {
    return {
      id: id,
      nickname: this.TEST_STUDENT_DATA.nickname,
      email: this.TEST_STUDENT_DATA.email,
    };
  }


}
