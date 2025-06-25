import { randomUUID } from 'node:crypto'
import { GetUserByEmail } from '@domain/examples/GetUserByEmail.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { GetUserByEmailHandler } from './examples/GetUserByEmailHandler.ts'

describe('queryHandler', () => {
  const store = 'users'
  let database: InMemoryDatabase
  let user: { id: string, email: string }

  beforeEach(async () => {
    database = new InMemoryDatabase()
    user = { id: randomUUID(), email: 'elon@x.com' }
    await database.execute(store, { operation: Operation.CREATE, payload: user })
  })

  it('should be defined', () => {
    expect(GetUserByEmailHandler).toBeDefined()
  })

  it('should return the requested data', async () => {
    const query = GetUserByEmail({ email: user.email })
    const handler = new GetUserByEmailHandler(database)

    const results = await handler.execute(query)
    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })
})
