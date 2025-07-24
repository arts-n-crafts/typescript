import { FieldGreaterThan } from './FieldGreaterThan.specification.ts'

describe('fieldGreaterThan', () => {
  const spec = new FieldGreaterThan('age', 18)

  it('returns true when field is greater than', () => {
    expect(spec.isSatisfiedBy({ age: 20 })).toBe(true)
  })

  it('returns false when field is less than or equal to', () => {
    expect(spec.isSatisfiedBy({ age: 17 })).toBe(false)
    expect(spec.isSatisfiedBy({ age: 18 })).toBe(false)
  })

  it('returns false when field is missing', () => {
    expect(spec.isSatisfiedBy({ name: 'John' })).toBe(false)
  })

  it('returns false when entity is null or non-object', () => {
    expect(spec.isSatisfiedBy(null)).toBe(false)
    expect(spec.isSatisfiedBy('invalid')).toBe(false)
    expect(spec.isSatisfiedBy(42)).toBe(false)
  })

  it('throws if field is not a number', () => {
    const invalid = () => spec.isSatisfiedBy({ age: 'twenty' })
    expect(invalid).toThrow(TypeError)
    expect(invalid).toThrow('Field age is not a number')
  })

  it('toQuery returns correct shape', () => {
    expect(spec.toQuery()).toEqual({
      type: 'gt',
      field: 'age',
      value: 18,
    })
  })
})
