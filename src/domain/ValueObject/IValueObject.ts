export interface IValueObject<TProps> {
  readonly value: TProps
  equals: (other: IValueObject<TProps>) => boolean
}
