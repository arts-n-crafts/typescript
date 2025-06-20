import type { GetUserByEmailProps } from './examples/GetUserByEmail.ts'
import type { Query } from './Query.ts'
import { GetUserByEmail } from './examples/GetUserByEmail.ts'
import { createQuery } from './utils/createQuery.ts'

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
    const query = GetUserByEmail(payload)
    expect(query.type).toBe('GetUserByEmail')
  })

  it('should contain the valid information', () => {
    const query = GetUserByEmail(payload)
    expect(query.payload.email).toBe('test')
  })

  it('should have a type', () => {
    const query = GetUserByEmail(payload)
    expect(query.metadata.kind).toBe('query')
  })
})
