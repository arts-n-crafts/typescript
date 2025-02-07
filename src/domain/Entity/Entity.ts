import type { Maybe } from "../../core/types/Maybe";

export interface IEntity<TProps> {
  readonly id: Maybe<string>;                   // The unique identifier for the entity
  readonly props: TProps;                       // The properties of the entity
  equals(other: IEntity<TProps>): boolean;              // Equality based on ID
}

export abstract class Entity<TProps> implements IEntity<TProps> {
  readonly _id: IEntity<TProps>['id'];
  readonly _props: TProps;

  protected constructor(props: TProps, id: IEntity<TProps>['id']) {
    this._id = id;
    this._props = props;
  }

  get id(): IEntity<TProps>['id'] {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }

  equals(other: IEntity<TProps>): boolean {
    return this.id === other.id;
  }
}
