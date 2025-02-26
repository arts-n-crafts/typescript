import type { GetUserByEmailQueryProps } from './examples/GetUserByEmailQuery'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserByEmailQuery } from './examples/GetUserByEmailQuery'
import { Query } from './Query'

describe('query', () => {
  let payload: GetUserByEmailQueryProps

  beforeEach(() => {
    payload = { email: 'test' }
  })

  it('should be defined', () => {
    expect(Query).toBeDefined()
  })

  it('should create an instance', () => {
    const query = new GetUserByEmailQuery(payload)
    expect(query).toBeInstanceOf(GetUserByEmailQuery)
  })

  it('should contain the valid information', () => {
    const query = new GetUserByEmailQuery(payload)
    expect(query.payload.email).toBe('test')
  })

  it('should have a type', () => {
    const query = new GetUserByEmailQuery(payload)
    expect(query.type).toBe('query')
  })
})
