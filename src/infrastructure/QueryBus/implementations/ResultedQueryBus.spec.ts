import type { GetUserByEmail, GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { UserModel } from '@core/examples/UserProjection.ts'
import type { SimpleDatabaseResult } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import type { Result } from 'oxide.ts'
import type { CreateStatement, Database } from '../../Database/Database.ts'
import type { QueryBus } from '../QueryBus.ts'
import { randomUUID } from 'node:crypto'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { Operation } from '../../Database/Database.ts'
import { ResultedQueryBus } from './ResultedQueryBus.ts'

describe('resulted query bus', () => {
  const store = 'users'
  let database: Database<UserModel, SimpleDatabaseResult>
  let statement: CreateStatement<UserModel>
  let payload: GetUserByEmailProps
  let bus: QueryBus<GetUserByEmail, Result<UserModel[], Error>, Result<void, Error>>

  beforeEach(async () => {
    bus = new ResultedQueryBus<GetUserByEmail, UserModel[]>()
    database = new SimpleDatabase()
    statement = { operation: Operation.CREATE, payload: { id: randomUUID(), name: 'Elon', email: 'elon@x.com', prospect: true } }
    await database.execute(store, statement)
    payload = { email: statement.payload.email }
  })

  it('should be defined', () => {
    expect(ResultedQueryBus).toBeDefined()
  })

  it('should be able to register a handler', () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)
    const result = bus.register(query.type, handler)
    expect(result.isOk()).toBeTruthy()
  })

  it('should throw an error if the query handler is already registered', () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)

    bus.register(query.type, handler)
    const result = bus.register(query.type, handler)
    expect(result.isErr()).toBeTruthy()
    expect(result.unwrapErr().message).toBe(`Handler already registered for query type: ${query.type}`)
    // expect(result.error).toBe(`Handler already registered for query type: ${query.type}`)
  })

  it('should execute a query', async () => {
    const query = createGetUserByEmailQuery(payload)
    const handler = new GetUserByEmailHandler(database)
    bus.register(query.type, handler)

    const results = await bus.execute(query)

    expect(results.isOk()).toBeTruthy()
    expect(results.unwrap()[0].id).toEqual(statement.payload.id)
    expect(results.unwrap()).toHaveLength(1)
  })

  it('should throw an error if the query handler is not registered', async () => {
    const query = createGetUserByEmailQuery(payload)
    const result = await bus.execute(query)
    expect(result.isErr()).toBeTruthy()
    expect(result.unwrapErr().message).toBe(`No handler found for query type: ${query.type}`)
  })
})
