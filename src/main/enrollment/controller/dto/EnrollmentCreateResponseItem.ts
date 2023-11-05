export class EnrollmentCreateResponseItem {
  constructor(
    private readonly id: number,
    private readonly lectureId: number,
    private readonly studentId: number,
  ) {}
}
