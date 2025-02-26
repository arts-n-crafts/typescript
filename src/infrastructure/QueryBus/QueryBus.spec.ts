import type { GetUserByEmailQueryProps } from './examples/GetUserByEmailQuery'
import type { GetUserByEmailQueryResult } from './examples/GetUserByEmailQueryHandler'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { Operation } from '../Database/Database'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { GetUserByEmailQuery } from './examples/GetUserByEmailQuery'
import { GetUserByEmailQueryHandler } from './examples/GetUserByEmailQueryHandler'
import { QueryBus } from './QueryBus'

describe('queryBus', () => {
  const store = 'users'
  let database: InMemoryDatabase
  let user: { id: string, email: string }
  let payload: GetUserByEmailQueryProps

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
    const handler = new GetUserByEmailQueryHandler(database)
    expect(bus.register(GetUserByEmailQuery, handler)).toBeUndefined()
  })

  it('should throw an error if the query handler is already registered', () => {
    const bus = new QueryBus()
    const handler = new GetUserByEmailQueryHandler(database)

    bus.register(GetUserByEmailQuery, handler)

    expect(() => bus.register(GetUserByEmailQuery, handler)).toThrow(`Handler already registered for query type: ${GetUserByEmailQuery.name}`)
  })

  it('should execute a query', async () => {
    const query = new GetUserByEmailQuery(payload)
    const handler = new GetUserByEmailQueryHandler(database)
    const bus = new QueryBus()
    bus.register(GetUserByEmailQuery, handler)

    const results = await bus.execute<GetUserByEmailQueryResult[]>(query)

    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = new GetUserByEmailQuery(payload)
    const bus = new QueryBus()
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${GetUserByEmailQuery.name}`)
  })
})
