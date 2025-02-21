interface IValueObject<TValue> {
  readonly value: TValue
  equals: (other: IValueObject<TValue>) => boolean
  toPrimitive: () => TValue
}
