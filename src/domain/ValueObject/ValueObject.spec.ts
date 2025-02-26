import { describe, expect, it } from 'vitest'
import { StringValueObject } from './examples/StringValueObject'
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
  ])('should equal based on hash if its value is equal [$__scenario]', async (props) => {
    const valueOne = StringValueObject.create(props.input.value)
    const valueTwo = StringValueObject.create(props.input.value)
    const isEqual = await valueOne.equals(valueTwo)
    expect(isEqual).toBeTruthy()
  })
})
