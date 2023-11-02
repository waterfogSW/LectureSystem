import { LectureCategory } from '../../main/domain/LectureEnums';

export class TestLectureDataFactory {

  static readonly TEST_LECTURE_DATA = {
    title: 'Test Lecture',
    introduction: 'This is a test lecture',
    instructorId: 1,
    category: LectureCategory.WEB,
    price: 100,
  };

  public static createData(
    {
      title = this.TEST_LECTURE_DATA.title,
      introduction = this.TEST_LECTURE_DATA.introduction,
      instructorId = this.TEST_LECTURE_DATA.instructorId,
      category = this.TEST_LECTURE_DATA.category,
      price = this.TEST_LECTURE_DATA.price,
    } = {},
  ): any {
    return {
      title: title,
      introduction: introduction,
      instructorId: instructorId,
      category: category,
      price: price,
    };
  }

  public static createMultipleData(num: number): Array<any> {
    return Array.from({ length: num }, (
      _value,
      i,
    ) => this.createData({ title: `Test Lecture ${ i }` }));
  }
}
