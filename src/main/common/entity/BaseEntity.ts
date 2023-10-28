import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

export type Id = number | undefined;

export abstract class BaseEntity {

  @IsOptional()
  @IsInt({ message: 'ID 는 양수여야 합니다.' })
  @IsPositive({ message: 'ID 는 양수여야 합니다.' })
  private readonly _id: Id;

  @IsDate({ message: '생성일은 Date 타입이어야 합니다.' })
  private readonly _createdAt: Date;

  @IsDate({ message: '수정일은 Date 타입이어야 합니다.' })
  private readonly _updatedAt: Date;

  protected constructor(
    id: Id,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  public get id(): Id {
    return this._id;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
