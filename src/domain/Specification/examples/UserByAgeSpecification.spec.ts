import { describe, expect, it } from 'vitest'
import { User } from '../../AggregateRoot/examples/User'
import { UserByAgeSpecification } from './UserByAgeSpecification'

describe('userByAgeSpecification', () => {
  const candidate = 30
  const specification = new UserByAgeSpecification(candidate)

  it('should be defined', () => {
    expect(UserByAgeSpecification).toBeDefined()
  })

  it('should return true if the age is the same', () => {
    const user = User.create('123', { name: 'test', email: '', age: candidate })
    expect(specification.isSatisfiedBy(user)).toBe(true)
  })

  it('should return false if the age is not the same', () => {
    const user = User.create('123', { name: 'test', email: '', age: 31 })
    expect(specification.isSatisfiedBy(user)).toBe(false)
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ age: candidate }])
  })
})
