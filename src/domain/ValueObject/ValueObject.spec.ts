import { describe, expect, it } from 'vitest'
import { ValueObject } from './ValueObject'

describe('valueObject', () => {
  it('should be defined', () => {
    expect(ValueObject).toBeDefined()
  })

  it('should implement IValueObject', () => {
    expect('value' in ValueObject.prototype).toBeTruthy()
    expect('equals' in ValueObject.prototype).toBeTruthy()
  })
})
