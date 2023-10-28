import { Lecture } from '../../main/domain/Lecture';

export class TestLectureDataFactory {

  static readonly TEST_LECTURE_DATA = {
    title: 'Test Lecture',
    introduction: 'This is a test lecture',
    instructorId: 1,
    category: 'WEB',
    price: 100,
  }

  public static createData(): any {
    return {
      title: this.TEST_LECTURE_DATA.title,
      introduction: this.TEST_LECTURE_DATA.introduction,
      instructorId: this.TEST_LECTURE_DATA.instructorId,
      category: this.TEST_LECTURE_DATA.category,
      price: this.TEST_LECTURE_DATA.price,
    }
  }

  public static createDataWithCategory(category: string): any {
    return {
      title: this.TEST_LECTURE_DATA.title,
      introduction: this.TEST_LECTURE_DATA.introduction,
      instructorId: this.TEST_LECTURE_DATA.instructorId,
      category: category,
      price: this.TEST_LECTURE_DATA.price,
    }
  }

  public static createWithId(id: number | undefined): Lecture {
    return new Lecture(
      id,
      'Test Lecture',
      'This is a test lecture',
      1,
      'WEB',
      100
    );
  }

}
