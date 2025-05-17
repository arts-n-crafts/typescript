import type { GetUserByEmailProps } from './examples/GetUserByEmail'
import type { GetUserByEmailResult } from './examples/GetUserByEmailHandler'
import { randomUUID } from 'node:crypto'
import { Operation } from '../Database/Database'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { GetUserByEmail } from './examples/GetUserByEmail'
import { GetUserByEmailHandler } from './examples/GetUserByEmailHandler'
import { QueryBus } from './QueryBus'

describe('queryBus', () => {
  const store = 'users'
  let database: InMemoryDatabase
  let user: { id: string, email: string }
  let payload: GetUserByEmailProps

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
    const handler = new GetUserByEmailHandler(database)
    expect(bus.register('GetUserByEmail', handler)).toBeUndefined()
  })

  it('should throw an error if the query handler is already registered', () => {
    const bus = new QueryBus()
    const handler = new GetUserByEmailHandler(database)

    bus.register('GetUserByEmail', handler)

    expect(() => bus.register('GetUserByEmail', handler)).toThrow(`Handler already registered for query type: ${GetUserByEmail.name}`)
  })

  it('should execute a query', async () => {
    const query = GetUserByEmail(payload)
    const handler = new GetUserByEmailHandler(database)
    const bus = new QueryBus()
    bus.register('GetUserByEmail', handler)

    const results = await bus.execute<GetUserByEmailResult[]>(query)

    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = GetUserByEmail(payload)
    const bus = new QueryBus()
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${GetUserByEmail.name}`)
  })
})
