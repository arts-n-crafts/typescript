export interface IEntity {
  readonly id: string;                          // The unique identifier for the entity
  readonly props: object;                       // The properties of the entity
  equals(other: IEntity): boolean;              // Equality based on ID
}

export abstract class Entity<TProps extends object> implements IEntity {
  readonly _id: string;
  readonly _props: TProps;

  constructor(id: string, props: TProps) {
    this._id = id;
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }

  equals(other: IEntity): boolean {
    return this.id === other.id;
  }
}
