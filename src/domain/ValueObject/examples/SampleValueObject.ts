import { ValueObject } from '../ValueObject'

export class SampleValueObject extends ValueObject<unknown> {
  static create(value: unknown): SampleValueObject {
    return new this(value)
  }
}
