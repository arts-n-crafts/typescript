interface IValueObject<TValue> {
  readonly value: TValue
  equals: (other: IValueObject<TValue>) => boolean
}

export abstract class ValueObject<TValue> implements IValueObject<TValue> {
  get value(): TValue {
    throw new Error('Method not implemented')
  }

  equals(_other: IValueObject<TValue>): boolean {
    throw new Error('Method not implemented')
  }
}
