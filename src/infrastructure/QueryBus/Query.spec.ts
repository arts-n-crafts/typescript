import type { MockGetUserByEmailQueryProps } from './mocks/MockGetUserByEmailQuery'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockGetUserByEmailQuery } from './mocks/MockGetUserByEmailQuery'
import { Query } from './Query'

describe('query', () => {
  let payload: MockGetUserByEmailQueryProps

  beforeEach(() => {
    payload = { email: 'test' }
  })

  it('should be defined', () => {
    expect(Query).toBeDefined()
  })

  it('should create an instance', () => {
    const query = new MockGetUserByEmailQuery(payload)
    expect(query).toBeInstanceOf(MockGetUserByEmailQuery)
  })

  it('should contain the valid information', () => {
    const query = new MockGetUserByEmailQuery(payload)
    expect(query.payload.email).toBe('test')
  })
})
