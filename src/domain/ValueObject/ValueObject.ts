interface IValueObject<TValue> {
  readonly value: TValue
  equals: (other: IValueObject<TValue>) => boolean
  toPrimitive: () => TValue
}

export abstract class ValueObject { // implements IValueObject<TValue> {
}
