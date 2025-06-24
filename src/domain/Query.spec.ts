import type { GetUserByEmailProps } from './examples/GetUserByEmail'
import type { Query } from './Query'
import { GetUserByEmail } from './examples/GetUserByEmail'
import { createQuery } from './utils/createQuery'

describe('query', () => {
  let payload: GetUserByEmailProps
  let query: Query

  beforeEach(() => {
    payload = { email: 'test' }
    query = createQuery('testQuery', payload)
  })

  it('should be defined', () => {
    expect(query).toBeDefined()
  })

  it('should create an instance', () => {
    const getUserByEmailQuery = GetUserByEmail(payload)
    expect(getUserByEmailQuery.type).toBe('GetUserByEmail')
  })

  it('should contain the valid information', () => {
    const getUserByEmailQuery = GetUserByEmail(payload)
    expect(getUserByEmailQuery.payload.email).toBe('test')
  })

  it('should have a type', () => {
    const getUserByEmailQuery = GetUserByEmail(payload)
    expect(getUserByEmailQuery.metadata.kind).toBe('query')
  })
})
