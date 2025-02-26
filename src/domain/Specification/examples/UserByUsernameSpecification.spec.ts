import { describe, expect, it } from 'vitest'
import { User } from '../../AggregateRoot/examples/User'
import { UserByUsernameSpecification } from './UserByUsernameSpecification'

describe('userByUsernameSpecification', () => {
  const candidate = 'test'
  const specification = new UserByUsernameSpecification(candidate)

  it('should be defined', () => {
    expect(UserByUsernameSpecification).toBeDefined()
  })

  it('should return true if the username is the same', () => {
    const user = User.create({ name: candidate, email: '' }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(true)
  })

  it('should return false if the username is not the same', () => {
    const user = User.create({ name: 'test2', email: '' }, '123')
    expect(specification.isSatisfiedBy(user)).toBe(false)
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ name: candidate }])
  })
})
