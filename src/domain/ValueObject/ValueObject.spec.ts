import { SampleValueObject } from './examples/SampleValueObject'
import { ValueObject } from './ValueObject'

describe('valueObject', () => {
  it('should be defined', () => {
    expect(ValueObject).toBeDefined()
  })

  it('should implement the abstract ValueObject', () => {
    expect('value' in ValueObject.prototype).toBeTruthy()
    expect('equals' in ValueObject.prototype).toBeTruthy()
  })

  describe.each([
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
  ])('should succeed [$__scenario]', (props) => {
    it('should return the value given', () => {
      const candidate = SampleValueObject.create(props.input.value)
      expect(candidate.value).toEqual(props.input.value)
    })

    it('should equal based on hash if its value is equal', () => {
      const candidate = SampleValueObject.create(props.input.value)
      const other = SampleValueObject.create(props.input.value)

      const isEqual = candidate.equals(other)
      expect(isEqual).toBeTruthy()
    })
  })

  describe.each([
    { __scenario: 'different normal strings', candidate: { value: 'this is a string' }, other: { value: 'this is another string' } },
    { __scenario: 'different very long strings', candidate: { value: 'this is a very very very very very very very very very long string' }, other: { value: 'this is a very very very very very very very very very different long string' } },
    { __scenario: 'string vs empty string', candidate: { value: 'non-empty string' }, other: { value: '' } },
    { __scenario: 'different objects', candidate: { value: { name: 'Elon', email: 'elon@x.com' } }, other: { value: { name: 'Jeff', email: 'jeff@amazon.com' } } },
    { __scenario: 'object vs empty object', candidate: { value: { name: 'Elon', email: 'elon@x.com' } }, other: { value: {} } },
    { __scenario: 'different arrays', candidate: { value: [1, 2, 3] }, other: { value: [4, 5, 6] } },
    { __scenario: 'array vs empty array', candidate: { value: [1, 2, 3] }, other: { value: [] } },
    { __scenario: 'different numbers', candidate: { value: 42 }, other: { value: 43 } },
    { __scenario: 'positive vs negative number', candidate: { value: 42 }, other: { value: -42 } },
    { __scenario: 'number vs zero', candidate: { value: 42 }, other: { value: 0 } },
    { __scenario: 'true vs false', candidate: { value: true }, other: { value: false } },
    { __scenario: 'boolean vs null', candidate: { value: true }, other: { value: null } },
    { __scenario: 'different nested objects', candidate: { value: { user: { name: 'Alice', address: { city: 'Wonderland' } } } }, other: { value: { user: { name: 'Bob', address: { city: 'Nowhere' } } } } },
    { __scenario: 'different arrays of numbers', candidate: { value: [1, 2, 3, 4, 5] }, other: { value: [5, 4, 3, 2, 1] } },
    { __scenario: 'different arrays of strings', candidate: { value: ['a', 'b', 'c'] }, other: { value: ['x', 'y', 'z'] } },
    { __scenario: 'different arrays of mixed types', candidate: { value: [1, 'a', true, null, { key: 'value' }] }, other: { value: [2, 'b', false, undefined, { key: 'different' }] } },
    { __scenario: 'different date objects', candidate: { value: new Date('2023-01-01') }, other: { value: new Date('2024-01-01') } },
    { __scenario: 'different regex objects', candidate: { value: /abc/ }, other: { value: /def/ } },
    { __scenario: 'symbol vs different symbol', candidate: { value: Symbol('symbol1') }, other: { value: Symbol('symbol2') } },
    { __scenario: 'undefined vs null', candidate: { value: undefined }, other: { value: null } },
  ])('should fail [$__scenario]', (props) => {
    it('should not equal based on hash if its value is not equal', () => {
      const candidate = SampleValueObject.create(props.candidate.value)
      const other = SampleValueObject.create(props.other.value)

      const isEqual = candidate.equals(other)
      expect(isEqual).toBeFalsy()
    })
  })
})
