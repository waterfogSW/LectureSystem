import { TestLectureDataFactory } from './TestLectureDataFactory';
import { Lecture } from '../../main/domain/Lecture';
import { Id } from '../../main/common/model/BaseModel';

export class TestLectureFactory {

  private static readonly TEST_LECTURE_DATA = TestLectureDataFactory.createData();

  public static createWithId(id: Id): Lecture {
    return new Lecture(
      id,
      this.TEST_LECTURE_DATA.title,
      this.TEST_LECTURE_DATA.introduction,
      this.TEST_LECTURE_DATA.instructorId,
      this.TEST_LECTURE_DATA.category,
      this.TEST_LECTURE_DATA.price,
    );
  }

  public static create(): Lecture {
    return new Lecture(
      undefined,
      this.TEST_LECTURE_DATA.title,
      this.TEST_LECTURE_DATA.introduction,
      this.TEST_LECTURE_DATA.instructorId,
      this.TEST_LECTURE_DATA.category,
      this.TEST_LECTURE_DATA.price,
    )
  }
}
