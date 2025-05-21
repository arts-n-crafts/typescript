import { User } from '../AggregateRoot/examples/User'
import { UserByUsernameSpecification } from './examples/UserByUsernameSpecification'
import { Specification } from './Specification'

describe('base Specification', () => {
  const candidate = 'John Doe'
  const specification = new UserByUsernameSpecification(candidate)

  it('should be defined', () => {
    expect(Specification).toBeDefined()
  })

  it('should be satisfied', () => {
    const user = User.create('123', { name: candidate, email: 'test' })
    expect(specification.isSatisfiedBy(user)).toBeTruthy()
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery()
    expect(query).toStrictEqual([{ name: candidate }])
  })
})
