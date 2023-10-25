export abstract class BaseModel {
  private readonly _id?: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  protected constructor(id?: number) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  public get id(): number | undefined {
    return this._id;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
