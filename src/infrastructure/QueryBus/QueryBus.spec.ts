import type { MockGetUserByEmailQueryProps } from './mocks/MockGetUserByEmailQuery'
import type { MockGetUserByEmailQueryResult } from './mocks/MockGetUserByEmailQueryHandler'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { Operation } from '../Database/Database'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { MockGetUserByEmailQuery } from './mocks/MockGetUserByEmailQuery'
import { MockGetUserByEmailQueryHandler } from './mocks/MockGetUserByEmailQueryHandler'
import { QueryBus } from './QueryBus'

describe('queryBus', () => {
  const store = 'users'
  let database: InMemoryDatabase
  let user: { id: string, email: string }
  let payload: MockGetUserByEmailQueryProps

  beforeEach(async () => {
    database = new InMemoryDatabase()
    user = { id: randomUUID(), email: 'elon@x.com' }
    await database.execute(store, { operation: Operation.CREATE, payload: user })
    payload = { email: user.email }
  })

  it('should be defined', () => {
    const bus = new QueryBus()
    expect(bus).toBeDefined()
  })

  it('should be able to register a handler', () => {
    const bus = new QueryBus()
    const handler = new MockGetUserByEmailQueryHandler(database)
    expect(bus.register(MockGetUserByEmailQuery, handler)).toBeUndefined()
  })

  it('should throw an error if the query handler is already registered', () => {
    const bus = new QueryBus()
    const handler = new MockGetUserByEmailQueryHandler(database)

    bus.register(MockGetUserByEmailQuery, handler)

    expect(() => bus.register(MockGetUserByEmailQuery, handler)).toThrow(`Handler already registered for query type: ${MockGetUserByEmailQuery.name}`)
  })

  it('should execute a query', async () => {
    const query = new MockGetUserByEmailQuery(payload)
    const handler = new MockGetUserByEmailQueryHandler(database)
    const bus = new QueryBus()
    bus.register(MockGetUserByEmailQuery, handler)

    const results = await bus.execute<MockGetUserByEmailQueryResult[]>(query)

    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = new MockGetUserByEmailQuery(payload)
    const bus = new QueryBus()
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${MockGetUserByEmailQuery.name}`)
  })
})
