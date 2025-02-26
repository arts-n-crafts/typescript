import { describe, expect, it } from 'vitest'
import { User } from '../AggregateRoot/examples/User'
import { AndSpecification } from './AndSpecification'
import { UserByAgeSpecification } from './examples/UserByAgeSpecification'
import { UserByUsernameSpecification } from './examples/UserByUsernameSpecification'

describe('andSpecification', () => {
  it('should be defined', () => {
    expect(AndSpecification).toBeDefined()
  })

  it('should satisfy the AndSpecification', () => {
    const username = 'elon_musk'
    const age = 30

    const usernameSpec = new UserByUsernameSpecification(username)
    const ageSpec = new UserByAgeSpecification(age)
    const andSpec = new AndSpecification(usernameSpec, ageSpec)
    const user = User.create({
      name: username,
      email: 'elon@x.com',
      age,
    }, '123')

    expect(andSpec.isSatisfiedBy(user)).toBe(true)
  })

  it.each([
    { _scenario: 'INVALID_USERNAME', username: 'elon', age: 30 },
    { _scenario: 'INVALID_AGE', username: 'elon_musk', age: 31 },
  ])('should not satisfy the AndSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new UserByUsernameSpecification('elon_musk')
    const ageSpec = new UserByAgeSpecification(30)
    const andSpec = new AndSpecification(usernameSpec, ageSpec)
    const user = User.create({ name: username, email: 'elon@x.com', age }, '123')
    expect(andSpec.isSatisfiedBy(user)).toBe(false)
  })

  it('should return a flat AndSpecification', () => {
    const username = 'elon_musk'
    const age = 30
    const usernameSpec = new UserByUsernameSpecification(username)
    const ageSpec = new UserByAgeSpecification(age)
    const andSpec = new AndSpecification(usernameSpec, ageSpec)
    expect(andSpec.toQuery()).toStrictEqual([
      usernameSpec.toQuery(),
      ageSpec.toQuery(),
    ].flat())
  })
})
