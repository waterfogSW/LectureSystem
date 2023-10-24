export abstract class BaseModel {

  private readonly _id?: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  protected constructor(id?: number) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
