import { ValueObject } from '../ValueObject'

export class StringValueObject extends ValueObject<string> {
  static create(value: string): StringValueObject {
    return new this(value)
  }
}
