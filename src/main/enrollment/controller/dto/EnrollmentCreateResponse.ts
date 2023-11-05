import { Enrollment } from '../../domain/Enrollment';
import { EnrollmentCreateResponseItem } from './EnrollmentCreateResponseItem';


export class EnrollmentCreateResponse {

  private items: Array<EnrollmentCreateResponseItem>;

  constructor(items: Array<EnrollmentCreateResponseItem>) {
    this.items = items;
  }

  public static from(enrollment: Array<Enrollment>): EnrollmentCreateResponse {
    const items: Array<EnrollmentCreateResponseItem> = enrollment
      .map(({ id, lectureId, studentId }: Enrollment) => new EnrollmentCreateResponseItem(id!, lectureId, studentId));
    return new EnrollmentCreateResponse(items);
  }
}

