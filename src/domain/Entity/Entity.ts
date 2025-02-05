import type { Maybe } from "../../core/types/Maybe";

export interface IEntity {
  readonly id: Maybe<string>;                     // The unique identifier for the entity
  readonly props: object;                       // The properties of the entity
  equals(other: IEntity): boolean;              // Equality based on ID
}

export abstract class Entity<TProps extends IEntity['props']> implements IEntity {
  readonly _id: IEntity['id'];
  readonly _props: TProps;

  constructor(props: TProps, id: IEntity['id']) {
    this._id = id;
    this._props = props;
  }

  get id(): IEntity['id'] {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }

  equals(other: IEntity): boolean {
    return this.id === other.id;
  }
}
