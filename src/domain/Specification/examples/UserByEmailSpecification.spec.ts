import { describe, expect, it } from 'vitest'
import { User } from '../../AggregateRoot/examples/User'
import { UserByEmailSpecification } from './UserByEmailSpecification'

describe('userByEmailSpecification', () => {
  const candidate = 'elon@x.com'
  const specification = new UserByEmailSpecification(candidate)

  it('should be defined', () => {
    expect(UserByEmailSpecification).toBeDefined()
  })

  it('should return true if the email is the same', () => {
    const user = User.create({ name: 'test', email: candidate, age: 30 }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(true)
  })

  it('should return false if the email is not the same', () => {
    const user = User.create({ name: 'test', email: 'musk@x.com', age: 31 }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(false)
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ email: candidate }])
  })
})
