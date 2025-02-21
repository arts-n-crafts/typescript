import { describe, expect, it } from 'vitest'
import { MockUser } from '../../AggregateRoot/mocks/MockUser'
import { MockUserByAgeSpecification } from './MockUserByAgeSpecification'

describe('mockUserByAgeSpecification', () => {
  const candidate = 30
  const specification = new MockUserByAgeSpecification(candidate)

  it('should be defined', () => {
    expect(MockUserByAgeSpecification).toBeDefined()
  })

  it('should return true if the age is the same', () => {
    const user = MockUser.create({ name: 'test', email: '', age: candidate }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(true)
  })

  it('should return false if the age is not the same', () => {
    const user = MockUser.create({ name: 'test', email: '', age: 31 }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(false)
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ age: candidate }])
  })
})
