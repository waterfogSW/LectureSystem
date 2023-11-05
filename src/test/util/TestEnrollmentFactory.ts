import { Enrollment } from '../../main/enrollment/domain/Enrollment';

export class TestEnrollmentFactory {
  public static createWithId(id: number): Enrollment {
    return new Enrollment(id, 1, 1);
  }
}
