import { createHash } from '../../utils/Hash/createHash'

export abstract class ValueObject<TValue> {
  private readonly _value: TValue

  protected constructor(value: TValue) {
    this._value = value
  }

  get value(): TValue {
    throw new Error('Method not implemented')
  }

  async equals(other: ValueObject<TValue>): Promise<boolean> {
    const subject = await createHash(this._value)
    const candidate = await createHash(other._value)
    return subject === candidate
  }
}
