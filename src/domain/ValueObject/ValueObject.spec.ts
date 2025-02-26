import { describe, expect, it } from 'vitest'
import { SampleValueObject } from './examples/SampleValueObject'
import { ValueObject } from './ValueObject'

describe('valueObject', () => {
  it('should be defined', () => {
    expect(ValueObject).toBeDefined()
  })

  it('should implement IValueObject', () => {
    expect('value' in ValueObject.prototype).toBeTruthy()
    expect('equals' in ValueObject.prototype).toBeTruthy()
  })

  it.each([
    { __scenario: 'normal string', input: { value: 'this is a string' } },
    { __scenario: 'very long string', input: { value: 'this is a very very very very very very very very very long string' } },
    { __scenario: 'empty string', input: { value: '' } },
    { __scenario: 'empty object', input: { value: {} } },
    { __scenario: 'user object', input: { value: { name: 'Elon', email: 'elon@x.com' } } },
    { __scenario: 'empty array', input: { value: [] } },
    { __scenario: 'simple number', input: { value: 42 } },
    { __scenario: 'negative number', input: { value: -42 } },
    { __scenario: 'zero', input: { value: 0 } },
    { __scenario: 'boolean true', input: { value: true } },
    { __scenario: 'boolean false', input: { value: false } },
    { __scenario: 'nested object', input: { value: { user: { name: 'Alice', address: { city: 'Wonderland' } } } } },
    { __scenario: 'array of numbers', input: { value: [1, 2, 3, 4, 5] } },
    { __scenario: 'array of strings', input: { value: ['a', 'b', 'c'] } },
    { __scenario: 'array of mixed types', input: { value: [1, 'a', true, null, { key: 'value' }] } },
    { __scenario: 'date object', input: { value: new Date('2023-01-01') } },
    { __scenario: 'regex object', input: { value: /abc/ } },
    { __scenario: 'symbol', input: { value: Symbol('symbol') } },
    { __scenario: 'undefined', input: { value: undefined } },
    { __scenario: 'null', input: { value: null } },
  ])('should equal based on hash if its value is equal [$__scenario]', async (props) => {
    const candidate = SampleValueObject.create(props.input.value)
    const other = SampleValueObject.create(props.input.value)

    const isEqual = await candidate.equals(other)
    expect(isEqual).toBeTruthy()
  })
})
