export abstract class Entity<TProps> {
  readonly _id: string
  readonly _props: TProps

  protected constructor(props: TProps, id: string) {
    this._id = id
    this._props = props
  }

  get id(): string {
    return this._id
  }

  get props(): TProps {
    return this._props
  }

  equals(other: Entity<unknown>): boolean {
    return this.id === other.id
  }
}
