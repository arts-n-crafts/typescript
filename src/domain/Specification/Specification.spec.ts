import { describe, expect, it } from 'vitest'
import { MockUser } from '../AggregateRoot/mocks/MockUser'
import { MockUserByUsernameSpecification } from './mocks/MockUserByUsernameSpecification'
import { Specification } from './Specification'

describe('base Specification', () => {
  const candidate = 'John Doe'
  const specification = new MockUserByUsernameSpecification(candidate)

  it('should be defined', () => {
    expect(Specification).toBeDefined()
  })

  it('should be satisfied', () => {
    const user = MockUser.create({ name: candidate, email: '' }, '123')
    expect(specification.isSatisfiedBy(user)).toBeTruthy()
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ name: candidate }])
  })
})
