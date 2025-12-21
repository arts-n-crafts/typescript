import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { CreateStatement, Database } from '@infrastructure/Database/Database.ts'
import { randomUUID } from 'node:crypto'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { GetUserByEmailHandler } from './examples/GetUserByEmailHandler.ts'

describe('queryHandler', () => {
  const store = 'users'
  let database: Database<WithIdentifier<UserCreatedPayload>, Promise<void>, Promise<WithIdentifier<UserCreatedPayload>[]>>
  let statement: CreateStatement<WithIdentifier<UserCreatedPayload>>

  beforeEach(async () => {
    database = new SimpleDatabase()
    statement = { operation: Operation.CREATE, payload: { id: randomUUID(), name: 'Elon', email: 'elon@x.com', prospect: true } }
    await database.execute(store, statement)
  })

  it('should be defined', () => {
    expect(GetUserByEmailHandler).toBeDefined()
  })

  it('should return the requested data', async () => {
    const query = createGetUserByEmailQuery({ email: statement.payload.email })
    const handler = new GetUserByEmailHandler(database)

    const results = await handler.execute(query)
    expect(results[0].id).toEqual(statement.payload.id)
    expect(results).toHaveLength(1)
  })
})
