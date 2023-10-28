export class TestStudentDataFactory {

  private static readonly TEST_STUDENT_DATA = {
    nickname: 'test',
    email: 'test@example.com',
  };

  public static createData(): any {
    return {
      nickname: this.TEST_STUDENT_DATA.nickname,
      email: this.TEST_STUDENT_DATA.email,
    };
  }


}
