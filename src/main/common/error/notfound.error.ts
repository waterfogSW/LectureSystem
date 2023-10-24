export class NotfoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotfoundError';
  }
}
