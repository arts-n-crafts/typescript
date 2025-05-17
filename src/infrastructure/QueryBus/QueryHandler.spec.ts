import { randomUUID } from 'node:crypto'
import { Operation } from '../Database/Database'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { GetUserByEmail } from './examples/GetUserByEmail'
import { GetUserByEmailHandler } from './examples/GetUserByEmailHandler'
import { QueryHandler } from './QueryHandler'

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
    expect(QueryHandler).toBeDefined()
  })

  it('should return the requested data', async () => {
    const query = GetUserByEmail({ email: user.email })
    const handler = new GetUserByEmailHandler(database)

    const results = await handler.execute(query)
    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })
})
