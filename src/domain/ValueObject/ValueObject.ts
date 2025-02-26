import { createHash } from '../../utils/Hash/createHash'

export abstract class ValueObject<TValue> {
  private readonly _value: TValue

  protected constructor(value: TValue) {
    this._value = value
  }

  get value(): TValue {
    return this._value
  }

  equals(other: ValueObject<TValue>): boolean {
    const subject = createHash(this._value)
    const candidate = createHash(other._value)
    return subject === candidate
  }
}
