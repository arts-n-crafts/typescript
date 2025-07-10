import type { GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { Query } from './Query.ts'
import { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import { createQuery } from '@core/utils/createQuery.ts'

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
