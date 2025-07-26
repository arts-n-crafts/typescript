import { FieldGreaterThan } from './FieldGreaterThan.specification.ts'

interface User { status?: string, age: number }

describe('fieldGreaterThan', () => {
  it('returns true when field is greater than', () => {
    const spec = new FieldGreaterThan<User>('age', 18)
    expect(spec.isSatisfiedBy({ age: 20 })).toBe(true)
  })

  it('returns false when field is less than or equal to', () => {
    const spec = new FieldGreaterThan<User>('age', 18)
    expect(spec.isSatisfiedBy({ age: 17 })).toBe(false)
    expect(spec.isSatisfiedBy({ age: 18 })).toBe(false)
  })

  it('toQuery returns correct shape', () => {
    const spec = new FieldGreaterThan<User>('age', 18)
    expect(spec.toQuery()).toEqual({
      type: 'gt',
      field: 'age',
      value: 18,
    })
  })
})
