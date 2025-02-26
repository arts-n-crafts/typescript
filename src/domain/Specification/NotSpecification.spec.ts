import { describe, expect, it } from 'vitest'
import { User } from '../AggregateRoot/examples/User'
import { UserByUsernameSpecification } from './examples/UserByUsernameSpecification'
import { NotSpecification } from './NotSpecification'

describe('notSpecification', () => {
  it('should be defined', () => {
    expect(NotSpecification).toBeDefined()
  })

  it.each([
    { _scenario: 'VALID_USERNAME', username: 'elon_musk', age: 32 },
  ])('should not satisfy the NotSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new UserByUsernameSpecification(username)
    const notSpec = new NotSpecification(usernameSpec)
    const user = User.create({ name: username, email: 'elon@x.com', age }, '123')
    expect(notSpec.isSatisfiedBy(user)).toBe(false)
  })

  it.each([
    { _scenario: 'INVALID_USERNAME', username: 'elon', age: 32 },
  ])('should satisfy the NotSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new UserByUsernameSpecification('elon_musk')
    const notSpec = new NotSpecification(usernameSpec)
    const user = User.create({ name: username, email: 'elon@x.com', age }, '123')
    expect(notSpec.isSatisfiedBy(user)).toBe(true)
  })

  it('should return a flat NotSpecification', () => {
    const username = 'elon_musk'
    const usernameSpec = new UserByUsernameSpecification(username)
    const notSpec = new NotSpecification(usernameSpec)
    expect(notSpec.toQuery()).toStrictEqual([usernameSpec.toQuery()].flat())
  })
})
