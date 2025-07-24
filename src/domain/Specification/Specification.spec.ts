import { FieldEquals } from './implementations/FieldEquals.specification.ts'
import { FieldGreaterThan } from './implementations/FieldGreaterThan.specification.ts'

describe('specification combinators', () => {
  const isActive = new FieldEquals('status', 'active')
  const isAdult = new FieldGreaterThan('age', 17)

  it('andSpecification', () => {
    const spec = isActive.and(isAdult)
    expect(spec.isSatisfiedBy({ status: 'active', age: 18 })).toBe(true)
    expect(spec.isSatisfiedBy({ status: 'active', age: 16 })).toBe(false)
    expect(spec.toQuery()).toEqual({
      type: 'and',
      nodes: [isActive.toQuery(), isAdult.toQuery()],
    })
  })

  it('orSpecification', () => {
    const spec = isActive.or(isAdult)
    expect(spec.isSatisfiedBy({ status: 'inactive', age: 18 })).toBe(true)
    expect(spec.isSatisfiedBy({ status: 'active', age: 10 })).toBe(true)
    expect(spec.isSatisfiedBy({ status: 'inactive', age: 10 })).toBe(false)
    expect(spec.toQuery()).toEqual({
      type: 'or',
      nodes: [isActive.toQuery(), isAdult.toQuery()],
    })
  })

  it('notSpecification', () => {
    const spec = isActive.not()
    expect(spec.isSatisfiedBy({ status: 'inactive' })).toBe(true)
    expect(spec.isSatisfiedBy({ status: 'active' })).toBe(false)
    expect(spec.toQuery()).toEqual({
      type: 'not',
      node: isActive.toQuery(),
    })
  })
})
