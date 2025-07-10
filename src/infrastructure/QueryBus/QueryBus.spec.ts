import type { GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { GetUserByEmailResult } from '@core/examples/GetUserByEmailHandler.ts'
import { randomUUID } from 'node:crypto'
import { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { Operation } from '../Database/Database.ts'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase.ts'
import { InMemoryQueryBus } from './implementations/InMemoryQueryBus.ts'

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
    const bus = new InMemoryQueryBus()
    expect(bus).toBeDefined()
  })

  it('should be able to register a handler', () => {
    const bus = new InMemoryQueryBus()
    const handler = new GetUserByEmailHandler(database)
    expect(bus.register('GetUserByEmail', handler)).toBeUndefined()
  })

  it('should throw an error if the query handler is already registered', () => {
    const bus = new InMemoryQueryBus()
    const handler = new GetUserByEmailHandler(database)

    bus.register('GetUserByEmail', handler)

    expect(() => bus.register('GetUserByEmail', handler)).toThrow(`Handler already registered for query type: ${GetUserByEmail.name}`)
  })

  it('should execute a query', async () => {
    const query = GetUserByEmail(payload)
    const handler = new GetUserByEmailHandler(database)
    const bus = new InMemoryQueryBus()
    bus.register('GetUserByEmail', handler)

    const results = await bus.execute<GetUserByEmailResult[]>(query)

    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = GetUserByEmail(payload)
    const bus = new InMemoryQueryBus()
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${GetUserByEmail.name}`)
  })
})
