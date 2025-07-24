import type { Primitive } from '@core/types/Primitive.ts'
import { FieldEquals } from './FieldEquals.specification.ts'

describe('field specs', () => {
  const active = new FieldEquals('status', 'active')

  const user1 = { status: 'active', age: 25 }
  const user2 = { status: 'inactive', age: 17 }

  it('fieldEquals matches correctly', () => {
    expect(active.isSatisfiedBy(user1)).toBe(true)
    expect(active.isSatisfiedBy(user2)).toBe(false)
  })

  it('returns false if field is missing', () => {
    const spec = new FieldEquals('email', 'test@example.com')
    expect(spec.isSatisfiedBy(user1)).toBe(false)
  })

  it('returns false for null or non-object input', () => {
    const spec = new FieldEquals('status', 'active')
    expect(spec.isSatisfiedBy(null)).toBe(false)
    expect(spec.isSatisfiedBy('not-an-object')).toBe(false)
    expect(spec.isSatisfiedBy(123)).toBe(false)
  })

  it('toQuery returns correct query node', () => {
    const spec = new FieldEquals('age', 30 as Primitive)
    expect(spec.toQuery()).toEqual({
      type: 'eq',
      field: 'age',
      value: 30,
    })
  })
})
