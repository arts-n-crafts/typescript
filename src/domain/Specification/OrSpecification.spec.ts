import { describe, expect, it } from 'vitest'
import { User } from '../AggregateRoot/examples/User'
import { UserByAgeSpecification } from './examples/UserByAgeSpecification'
import { UserByUsernameSpecification } from './examples/UserByUsernameSpecification'
import { OrSpecification } from './OrSpecification'

describe('orSpecification', () => {
  it('should be defined', () => {
    expect(OrSpecification).toBeDefined()
  })

  it.each([
    { _scenario: 'VALID_USERNAME', username: 'elon_musk', age: 32 },
    { _scenario: 'VALID_AGE', username: 'elon', age: 30 },
  ])('should satisfy the OrSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new UserByUsernameSpecification(username)
    const ageSpec = new UserByAgeSpecification(age)
    const orSpec = new OrSpecification(usernameSpec, ageSpec)
    const user = User.create('123', { name: username, email: 'elon@x.com', age })
    expect(orSpec.isSatisfiedBy(user)).toBe(true)
  })

  it.each([
    { _scenario: 'INVALID_USERNAME_AND_AGE', username: 'elon', age: 32 },
  ])('should not satisfy the OrSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new UserByUsernameSpecification('elon_musk')
    const ageSpec = new UserByAgeSpecification(30)
    const andSpec = new OrSpecification(usernameSpec, ageSpec)
    const user = User.create('123', { name: username, email: 'elon@x.com', age })
    expect(andSpec.isSatisfiedBy(user)).toBe(false)
  })

  it('should return a flat OrSpecification', () => {
    const username = 'elon_musk'
    const age = 30
    const usernameSpec = new UserByUsernameSpecification(username)
    const ageSpec = new UserByAgeSpecification(age)
    const andSpec = new OrSpecification(usernameSpec, ageSpec)
    expect(andSpec.toQuery()).toStrictEqual([
      usernameSpec.toQuery(),
      ageSpec.toQuery(),
    ].flat())
  })
})
