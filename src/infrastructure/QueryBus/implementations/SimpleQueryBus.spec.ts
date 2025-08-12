import type { GetUserByEmail, GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { UserModel } from '@core/examples/UserProjection.ts'
import type { CreateStatement, Database } from '../../Database/Database.ts'
import type { QueryBus } from '../QueryBus.ts'
import { randomUUID } from 'node:crypto'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { Operation } from '../../Database/Database.ts'
import { SimpleQueryBus } from './SimpleQueryBus.ts'

describe('simple query bus', () => {
  const store = 'users'
  let database: Database<UserModel>
  let statement: CreateStatement<UserModel>
  let payload: GetUserByEmailProps
  let bus: QueryBus<GetUserByEmail, UserModel[]>

  beforeEach(async () => {
    bus = new SimpleQueryBus<GetUserByEmail, UserModel[]>()
    database = new SimpleDatabase()
    statement = { operation: Operation.CREATE, payload: { id: randomUUID(), name: 'Elon', email: 'elon@x.com', prospect: true } }
    await database.execute(store, statement)
    payload = { email: statement.payload.email }
  })

  it('should be defined', () => {
    expect(SimpleQueryBus).toBeDefined()
  })

  it('should be able to register a handler', () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)
    expect(bus.register(query.type, handler)).toBeUndefined()
  })

  it('should throw an error if the query handler is already registered', () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)

    bus.register(query.type, handler)

    expect(() => bus.register(query.type, handler)).toThrow(`Handler already registered for query type: ${query.type}`)
  })

  it('should execute a query', async () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)
    bus.register(query.type, handler)

    const results = await bus.execute(query)

    expect(results[0].id).toEqual(statement.payload.id)
    expect(results).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = createGetUserByEmailQuery(payload)
    await expect(bus.execute(query)).rejects.toThrowError(`No handler found for query type: ${query.type}`)
  })
})
