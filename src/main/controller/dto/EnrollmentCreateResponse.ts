import { Enrollment } from '../../domain/Enrollment';


export class EnrollmentCreateResponse {

  private items: Array<Item>;

  constructor(items: Array<Item>) {
    this.items = items;
  }

  public static from(enrollment: Array<Enrollment>): EnrollmentCreateResponse {
    const items: Array<Item> = enrollment
      .map(({ id, lectureId, studentId }: Enrollment) => new Item(id!, lectureId, studentId));
    return new EnrollmentCreateResponse(items);
  }
}

class Item {
  constructor(
    private readonly id: number,
    private readonly lectureId: number,
    private readonly studentId: number,
  ) {}
}
