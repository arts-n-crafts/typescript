import { randomUUID } from 'node:crypto'
import { Operation } from '../Database/Database'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { GetUserByEmailQuery } from './examples/GetUserByEmailQuery'
import { GetUserByEmailQueryHandler } from './examples/GetUserByEmailQueryHandler'
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
    const query = new GetUserByEmailQuery({ email: user.email })
    const handler = new GetUserByEmailQueryHandler(database)

    const results = await handler.execute(query)
    expect(results[0]?.id).toEqual(user.id)
    expect(results).toHaveLength(1)
  })
})
